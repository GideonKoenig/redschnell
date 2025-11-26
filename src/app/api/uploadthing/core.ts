import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getSession } from "~/lib/auth-server";
import { db } from "~/server/db";
import { sources } from "~/server/db/schema";

const f = createUploadthing();

export const ourFileRouter = {
    uploader: f({
        audio: { maxFileSize: "512MB", maxFileCount: 100 },
    })
        .middleware(async () => {
            const session = await getSession();
            if (!session) throw new UploadThingError("Unauthorized") as Error;
            return { userId: session.user.id };
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

            return { sourceId: source?.id };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
