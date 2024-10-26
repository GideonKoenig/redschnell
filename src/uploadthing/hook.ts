import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "~/app/api/uploadthing/core";

const { useUploadThing: useUploadThingUT, uploadFiles: uploadFilesUT } =
    generateReactHelpers<OurFileRouter>();

const useUploader = () => {
    return useUploadThingUT("uploader", {});
};
const uploadFiles = (files: File[]) => uploadFilesUT("uploader", { files });

export { useUploader, uploadFiles };
