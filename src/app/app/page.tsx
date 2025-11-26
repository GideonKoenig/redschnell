import { AudioLines, Upload } from "lucide-react";

export default function AppHome() {
    return (
        <div className="flex h-full flex-col items-center justify-center gap-8 p-8">
            <AudioLines className="text-border size-24" />

            <div className="flex max-w-md flex-col items-center gap-4 text-center">
                <h2 className="text-text text-2xl font-semibold">
                    Welcome to Redschnell
                </h2>
                <p className="text-text-muted">
                    Upload audio or video files to get instant transcriptions
                    with speaker detection and timestamps.
                </p>
            </div>

            <div className="border-border flex flex-col items-center gap-4 rounded-lg border-2 border-dashed p-8">
                <Upload className="text-text-muted size-10" />
                <p className="text-text-muted text-sm">
                    Drag and drop files here, or use the{" "}
                    <span className="text-accent font-medium">Upload</span>{" "}
                    button in the sidebar
                </p>
            </div>
        </div>
    );
}
