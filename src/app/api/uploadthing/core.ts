import { getToken } from "next-auth/jwt";
import { type NextRequest } from "next/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { db } from "~/server/db";
import { files } from "~/server/db/schema";

const f = createUploadthing();

const auth = async (req: NextRequest) => await getToken({ req });

export const ourFileRouter = {
    uploader: f({
        audio: { maxFileSize: "1GB", maxFileCount: 100 },
        video: { maxFileSize: "1GB", maxFileCount: 100 },
    })
        .middleware(async ({ req }) => {
            const token = await auth(req);
            if (!token) throw new UploadThingError("Unauthorized") as Error;
            return { userId: token.user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload complete for userId:", metadata.userId);
            console.log("file url", file.url);
            console.log("file.type");
            db.insert(files).values({
                type: file.type,
                url: file.url,
                owner: metadata.userId,
            });
            return;
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
