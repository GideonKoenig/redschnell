import { eq } from "drizzle-orm";
import { z } from "zod";
import {
    collapseConsecutiveSpeakers,
    TranscriptSchema,
    type Transcript,
    type TranscriptSegment,
} from "~/lib/schemas/transcript";
import {
    DEFAULT_MODEL,
    transcriptionModelSchema,
    type TranscriptionModel,
} from "~/lib/transcription-models";
import { transcribe, type TranscriptionResult } from "~/lib/transcription";
import { trackEvent } from "~/lib/plausible";
import { newError, tryCatch } from "~/lib/try-catch";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { type db } from "~/server/db";
import { sources, transcripts } from "~/server/db/schema";

function toTranscript(result: TranscriptionResult): Transcript {
    const segments: TranscriptSegment[] = result.chunks.map((chunk, index) => ({
        id: `segment-${index}`,
        start: chunk.start,
        end: chunk.end,
        text: chunk.text,
        speaker: chunk.speaker,
    }));

    return {
        segments,
        fullText: result.text,
    };
}

export const transcriptsRouter = createTRPCRouter({
    get: protectedProcedure
        .input(z.object({ sourceId: z.string().uuid() }))
        .query(async ({ ctx, input }) => {
            const source = await ctx.db.query.sources.findFirst({
                where: eq(sources.id, input.sourceId),
            });

            if (!source || source.owner !== ctx.session.user.id) {
                return null;
            }

            const existing = await ctx.db.query.transcripts.findFirst({
                where: eq(transcripts.sourceId, input.sourceId),
            });

            if (existing?.status === "completed") {
                return {
                    ...existing,
                    status: "completed" as const,
                    source: {
                        duration: source.duration,
                        fileSize: source.fileSize,
                    },
                };
            }

            if (existing?.status === "processing") {
                return { status: "processing" as const };
            }

            if (existing?.status === "failed") {
                return {
                    status: "failed" as const,
                    error: existing.error ?? "Transcription failed",
                };
            }

            const parsed = transcriptionModelSchema.safeParse(
                ctx.session.user.transcriptionModel,
            );
            const model = parsed.success ? parsed.data : DEFAULT_MODEL;

            const startedAt = new Date();

            if (existing) {
                await ctx.db
                    .update(transcripts)
                    .set({
                        status: "processing",
                        error: null,
                        model,
                        startedAt,
                    })
                    .where(eq(transcripts.id, existing.id));
            } else {
                await ctx.db.insert(transcripts).values({
                    sourceId: input.sourceId,
                    status: "processing",
                    model,
                    startedAt,
                });
            }

            void processTranscription(
                ctx.db,
                input.sourceId,
                source.url,
                model,
                source.duration,
            );

            return { status: "processing" as const };
        }),

    getStatus: protectedProcedure
        .input(z.object({ sourceId: z.string().uuid() }))
        .query(async ({ ctx, input }) => {
            const source = await ctx.db.query.sources.findFirst({
                where: eq(sources.id, input.sourceId),
                columns: { owner: true },
            });

            if (!source || source.owner !== ctx.session.user.id) {
                return null;
            }

            const transcript = await ctx.db.query.transcripts.findFirst({
                where: eq(transcripts.sourceId, input.sourceId),
                columns: { status: true, error: true },
            });

            return transcript ?? { status: "pending" as const };
        }),

    retry: protectedProcedure
        .input(z.object({ sourceId: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            const source = await ctx.db.query.sources.findFirst({
                where: eq(sources.id, input.sourceId),
            });

            if (!source || source.owner !== ctx.session.user.id) {
                return { success: false };
            }

            const existing = await ctx.db.query.transcripts.findFirst({
                where: eq(transcripts.sourceId, input.sourceId),
            });

            const parsed = transcriptionModelSchema.safeParse(
                ctx.session.user.transcriptionModel,
            );
            const model = parsed.success ? parsed.data : DEFAULT_MODEL;
            const startedAt = new Date();

            if (existing) {
                await ctx.db
                    .update(transcripts)
                    .set({
                        status: "processing",
                        error: null,
                        model,
                        startedAt,
                    })
                    .where(eq(transcripts.id, existing.id));
            } else {
                await ctx.db.insert(transcripts).values({
                    sourceId: input.sourceId,
                    status: "processing",
                    model,
                    startedAt,
                });
            }

            void processTranscription(
                ctx.db,
                input.sourceId,
                source.url,
                model,
                source.duration,
            );

            return { success: true };
        }),

    reprocess: protectedProcedure
        .input(z.object({ sourceId: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            const source = await ctx.db.query.sources.findFirst({
                where: eq(sources.id, input.sourceId),
                columns: { owner: true },
            });

            if (!source || source.owner !== ctx.session.user.id) {
                return { success: false };
            }

            const existing = await ctx.db.query.transcripts.findFirst({
                where: eq(transcripts.sourceId, input.sourceId),
            });

            if (!existing?.content) {
                return { success: false };
            }

            const content = existing.content as TranscriptionResult;
            const transcript = toTranscript(content);
            const collapsed = collapseConsecutiveSpeakers(transcript);

            await ctx.db
                .update(transcripts)
                .set({ processedContent: collapsed })
                .where(eq(transcripts.sourceId, input.sourceId));

            return { success: true };
        }),

    updateSpeakerNames: protectedProcedure
        .input(
            z.object({
                sourceId: z.string().uuid(),
                speakerNames: z.record(z.string(), z.string()),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const source = await ctx.db.query.sources.findFirst({
                where: eq(sources.id, input.sourceId),
                columns: { owner: true },
            });

            if (!source || source.owner !== ctx.session.user.id) {
                return { success: false };
            }

            const existing = await ctx.db.query.transcripts.findFirst({
                where: eq(transcripts.sourceId, input.sourceId),
            });

            if (!existing?.processedContent) {
                return { success: false };
            }

            const parsed = TranscriptSchema.safeParse(
                existing.processedContent,
            );
            if (!parsed.success) {
                return { success: false };
            }

            const updated: Transcript = {
                ...parsed.data,
                speakerNames: input.speakerNames,
            };

            await ctx.db
                .update(transcripts)
                .set({ processedContent: updated })
                .where(eq(transcripts.sourceId, input.sourceId));

            return { success: true };
        }),
});

export async function processTranscription(
    database: typeof db,
    sourceId: string,
    audioUrl: string,
    model: TranscriptionModel,
    durationSeconds: number,
) {
    const result = await transcribe(audioUrl, model, durationSeconds);

    const transcriptExists = await database.query.transcripts.findFirst({
        where: eq(transcripts.sourceId, sourceId),
        columns: { id: true },
    });

    if (!transcriptExists) return;

    if (result.success) {
        void trackEvent({ name: "transcription", props: { model } });

        const transcript = toTranscript(result.data);
        const collapsed = collapseConsecutiveSpeakers(transcript);
        const price = result.data.metadata?.priceUsd?.toString();

        await tryCatch(
            database
                .update(transcripts)
                .set({
                    status: "completed",
                    content: result.data,
                    processedContent: collapsed,
                    price,
                    completedAt: new Date(),
                })
                .where(eq(transcripts.sourceId, sourceId)),
        );
    } else {
        const error = newError(result.error);
        await tryCatch(
            database
                .update(transcripts)
                .set({
                    status: "failed",
                    error: error.message,
                    completedAt: new Date(),
                })
                .where(eq(transcripts.sourceId, sourceId)),
        );
    }
}
