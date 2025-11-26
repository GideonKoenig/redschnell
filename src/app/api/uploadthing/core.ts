import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getSession } from "~/lib/auth-server";
import {
    DEFAULT_MODEL,
    transcriptionModelSchema,
} from "~/lib/transcription-models";
import { processTranscription } from "~/server/api/routers/transcripts";
import { db } from "~/server/db";
import { sources, transcripts } from "~/server/db/schema";

const f = createUploadthing();

export const ourFileRouter = {
    uploader: f({
        audio: { maxFileSize: "512MB", maxFileCount: 100 },
    })
        .middleware(async () => {
            const session = await getSession();
            if (!session) throw new UploadThingError("Unauthorized") as Error;
            return {
                userId: session.user.id,
                autoTranscribe: session.user.autoTranscribe,
                transcriptionModel: session.user.transcriptionModel,
            };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            const [source] = await db
                .insert(sources)
                .values({
                    name: file.name,
                    url: file.url,
                    owner: metadata.userId,
                })
                .returning({ id: sources.id });

            if (!source) return { sourceId: undefined };

            if (metadata.autoTranscribe) {
                const parsed = transcriptionModelSchema.safeParse(
                    metadata.transcriptionModel,
                );
                const model = parsed.success ? parsed.data : DEFAULT_MODEL;
                await db.insert(transcripts).values({
                    sourceId: source.id,
                    status: "processing",
                    model,
                });
                void processTranscription(db, source.id, file.url, model);
            }

            return { sourceId: source.id };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
