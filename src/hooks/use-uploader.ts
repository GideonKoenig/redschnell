import { generateReactHelpers } from "@uploadthing/react";
import { usePlausible } from "next-plausible";
import { useRef } from "react";
import { toast } from "sonner";
import type { OurFileRouter } from "~/app/api/uploadthing/core";
import { useUploadProgress } from "~/components/providers/upload-progress-provider";
import { cancelConversion, convertAudio } from "~/lib/converter/convert";
import { newError, tryCatch } from "~/lib/try-catch";
import { api } from "~/trpc/react";

const { uploadFiles: uploadFilesUT } = generateReactHelpers<OurFileRouter>();

export function useUploader() {
    const { uploads, addUpload, updateUpload, dismissUpload } =
        useUploadProgress();
    const utils = api.useUtils();
    const plausible = usePlausible();
    const abortControllers = useRef(new Map<string, AbortController>());

    const uploadFiles = async (files: File[]) => {
        const fileUploads = files.map((file) => ({
            id: crypto.randomUUID(),
            file,
        }));

        for (const { id, file } of fileUploads) {
            addUpload(id, file.name);
            processAndUpload(id, file);
        }
    };

    const cancelUpload = (id: string) => {
        const fileName = uploads[id]?.fileName;
        cancelConversion(id);
        const controller = abortControllers.current.get(id);
        if (controller) {
            controller.abort();
            abortControllers.current.delete(id);
        }
        dismissUpload(id);
        toast.info(`${fileName ?? "Upload"} cancelled`);
    };

    const processAndUpload = async (id: string, file: File) => {
        const convertResult = await convertAudio(
            id,
            file,
            (progress) => {
                updateUpload(id, { progress });
            },
            () => {
                updateUpload(id, { phase: "converting", progress: 0 });
            },
        );

        if (!convertResult.success) {
            const error = newError(convertResult.error);
            if (
                error.message === "Cancelled" ||
                error.message.includes("abort")
            ) {
                return;
            }

            updateUpload(id, { phase: "error", error: error.message });
            toast.error(`Failed to convert ${file.name}: ${error.message}`);
            return;
        }

        updateUpload(id, { phase: "uploading", progress: 0 });

        const controller = new AbortController();
        abortControllers.current.set(id, controller);

        const uploadResult = await tryCatch(
            uploadFilesUT("uploader", {
                files: [convertResult.data],
                signal: controller.signal,
                onUploadProgress: ({ progress }) => {
                    updateUpload(id, { phase: "uploading", progress });
                },
            }),
        );

        abortControllers.current.delete(id);

        if (!uploadResult.success) {
            const error = newError(uploadResult.error);
            const msg = error.message.toLowerCase();
            if (!msg || msg === "cancelled" || msg.includes("abort")) {
                return;
            }
            updateUpload(id, { phase: "error", error: error.message });
            toast.error(`Failed to upload ${file.name}: ${error.message}`);
            return;
        }

        const result = uploadResult.data;
        if (result.length > 0 && result[0]) {
            plausible("file-upload");
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

    return { uploadFiles, cancelUpload };
}
