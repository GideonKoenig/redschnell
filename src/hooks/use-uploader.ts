import { generateReactHelpers } from "@uploadthing/react";
import { toast } from "sonner";
import type { OurFileRouter } from "~/app/api/uploadthing/core";
import { useUploadProgress } from "~/components/providers/upload-progress-provider";
import { convertAudio } from "~/lib/converter";
import { newError, tryCatch } from "~/lib/try-catch";
import { api } from "~/trpc/react";

const { uploadFiles: uploadFilesUT } = generateReactHelpers<OurFileRouter>();

export function useUploader() {
    const { addUpload, updateUpload, dismissUpload } = useUploadProgress();
    const utils = api.useUtils();

    const uploadFiles = async (files: File[]) => {
        const uploads = files.map((file) => ({
            id: crypto.randomUUID(),
            file,
        }));

        for (const { id, file } of uploads) {
            addUpload(id, file.name);
            processAndUpload(id, file);
        }
    };

    const processAndUpload = async (id: string, file: File) => {
        updateUpload(id, { phase: "converting", progress: 0 });

        const convertResult = await convertAudio(file, (progress) => {
            updateUpload(id, { phase: "converting", progress });
        });

        if (!convertResult.success) {
            const error = newError(convertResult.error);
            updateUpload(id, { phase: "error", error: error.message });
            toast.error(`Failed to convert ${file.name}: ${error.message}`);
            return;
        }

        updateUpload(id, { phase: "uploading", progress: 0 });

        const uploadResult = await tryCatch(
            uploadFilesUT("uploader", {
                files: [convertResult.data],
                onUploadProgress: ({ progress }) => {
                    updateUpload(id, { phase: "uploading", progress });
                },
            }),
        );

        if (!uploadResult.success) {
            const error = newError(uploadResult.error);
            updateUpload(id, { phase: "error", error: error.message });
            toast.error(`Failed to upload ${file.name}: ${error.message}`);
            return;
        }

        const result = uploadResult.data;
        if (result.length > 0 && result[0]) {
            await utils.sources.list.invalidate();
            dismissUpload(id);
            toast.success(`${file.name} uploaded successfully`);
            return;
        }

        updateUpload(id, {
            phase: "error",
            error: "Upload failed - no result returned",
        });
        toast.error(`Failed to upload ${file.name}: No result returned`);
    };

    return { uploadFiles };
}
