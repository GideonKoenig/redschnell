import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";
import { buildSettings, getSession } from "~/lib/auth-server";
import { processTranscription } from "~/server/api/routers/transcripts";
import { db } from "~/server/db";
import { sources, transcripts } from "~/server/db/schema";

const f = createUploadthing();

export const ourFileRouter = {
    uploader: f({
        audio: { maxFileSize: "512MB", maxFileCount: 100 },
    })
        // Conversion runs for minutes in the browser. If another tab switched accounts meanwhile, the file must not land in the new account.
        .input(z.object({ userId: z.string() }))
        .middleware(async ({ input }) => {
            const session = await getSession();
            if (session?.user.id !== input.userId)
                throw new UploadThingError("Unauthorized") as Error;
            return { user: session.user };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            const fileSize = file.size;
            const duration = Math.round((fileSize * 8) / 64000);

            const [source] = await db
                .insert(sources)
                .values({
                    name: file.name,
                    url: file.ufsUrl,
                    fileSize,
                    duration,
                    owner: metadata.user.id,
                })
                .returning({ id: sources.id });

            if (!source) return { sourceId: undefined };

            if (metadata.user.autoTranscribe) {
                const settings = buildSettings(metadata.user);
                await db.insert(transcripts).values({
                    sourceId: source.id,
                    status: "processing",
                    model: settings.transcriptionModel,
                    startedAt: new Date(),
                });
                void processTranscription(
                    db,
                    source.id,
                    file.ufsUrl,
                    settings,
                    duration,
                );
            }

            return { sourceId: source.id };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
