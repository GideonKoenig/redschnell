import { generateReactHelpers } from "@uploadthing/react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { type UploadFilesOptions as UploadFilesOptionsUT } from "uploadthing/types";
import type { OurFileRouter } from "~/app/api/uploadthing/core";
import { UploadProgressContext } from "~/uploadthing/upload-progress-provider";

const { uploadFiles: uploadFilesUT } = generateReactHelpers<OurFileRouter>();

type UseUploadFileProps = Pick<
    UploadFilesOptionsUT<OurFileRouter, keyof OurFileRouter>,
    "onUploadBegin" | "onUploadProgress"
>;

const useUploader = (
    endpoint: keyof OurFileRouter,
    config: Omit<UseUploadFileProps, "onUploadProgress"> = {},
) => {
    const context = useContext(UploadProgressContext);
    const router = useRouter();

    const setProgress = (
        tag: string,
        value: number,
        stopUpload?: () => void,
    ) => {
        if (value === 100) {
            setTimeout(() => {
                console.log("i triggered");
                router.refresh();
            }, 1500);
        }
        context.setProgressList((prev) => {
            const prevTag = prev[tag];
            const newEntry = {
                progress: value,
                stopUpload: (stopUpload ?? prevTag?.stopUpload)!,
            };
            return { ...prev, [tag]: newEntry };
        });
    };

    const uploadFiles = async (files: File[]) => {
        uploadFilesUT(endpoint, {
            ...config,
            files: files,
            onUploadProgress: ({ file, progress }) => {
                setProgress(file.name, progress, () => {
                    // Todo: Add aborting capability
                    console.log("aborting is not yet implemented");
                });
            },
        })
            .then((files) => {
                files.forEach((file) => {
                    context.setProgressList((prev) => {
                        const newTags = { ...prev };
                        delete newTags[file.name];
                        return newTags;
                    });
                });
                router.refresh();
            })
            .catch((error: Error) => {
                // Todo: Add Sonner for Error notifications in app
                console.log(error.message);
            });
    };

    return { uploadFiles };
};

export { useUploader };
