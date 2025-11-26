import { eq } from "drizzle-orm";
import { z } from "zod";
import {
    WhisperResponseSchema,
    whisperToTranscript,
    collapseConsecutiveSpeakers,
} from "~/lib/schemas/transcript";
import {
    DEFAULT_MODEL,
    transcriptionModelSchema,
    type TranscriptionModel,
} from "~/lib/transcription-models";
import { newError, tryCatch } from "~/lib/try-catch";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { type db } from "~/server/db";
import { sources, transcripts } from "~/server/db/schema";
import { transcribeAudio } from "~/server/fal/whisper";

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
                return existing;
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

            if (existing) {
                await ctx.db
                    .update(transcripts)
                    .set({ status: "processing", error: null, model })
                    .where(eq(transcripts.id, existing.id));
            } else {
                await ctx.db.insert(transcripts).values({
                    sourceId: input.sourceId,
                    status: "processing",
                    model,
                });
            }

            void processTranscription(
                ctx.db,
                input.sourceId,
                source.url,
                model,
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

            if (existing) {
                await ctx.db
                    .update(transcripts)
                    .set({ status: "processing", error: null, model })
                    .where(eq(transcripts.id, existing.id));
            } else {
                await ctx.db.insert(transcripts).values({
                    sourceId: input.sourceId,
                    status: "processing",
                    model,
                });
            }

            void processTranscription(
                ctx.db,
                input.sourceId,
                source.url,
                model,
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

            const parsed = WhisperResponseSchema.safeParse(existing.content);
            if (!parsed.success) {
                return { success: false };
            }

            const transcript = whisperToTranscript(parsed.data);
            const collapsed = collapseConsecutiveSpeakers(transcript);

            await ctx.db
                .update(transcripts)
                .set({ processedContent: collapsed })
                .where(eq(transcripts.sourceId, input.sourceId));

            return { success: true };
        }),
});

export async function processTranscription(
    database: typeof db,
    sourceId: string,
    audioUrl: string,
    model: TranscriptionModel,
) {
    const result = await transcribeAudio(audioUrl, model);

    const transcriptExists = await database.query.transcripts.findFirst({
        where: eq(transcripts.sourceId, sourceId),
        columns: { id: true },
    });

    if (!transcriptExists) return;

    if (result.success) {
        const parsed = WhisperResponseSchema.safeParse(result.data);
        let processedContent = null;

        if (parsed.success) {
            const transcript = whisperToTranscript(parsed.data);
            const collapsed = collapseConsecutiveSpeakers(transcript);
            processedContent = collapsed;
        }

        await tryCatch(
            database
                .update(transcripts)
                .set({
                    status: "completed",
                    content: result.data,
                    processedContent,
                    completedAt: new Date(),
                })
                .where(eq(transcripts.sourceId, sourceId)),
        );
    } else {
        const error = newError(result.error);
        await tryCatch(
            database
                .update(transcripts)
                .set({ status: "failed", error: error.message })
                .where(eq(transcripts.sourceId, sourceId)),
        );
    }
}
