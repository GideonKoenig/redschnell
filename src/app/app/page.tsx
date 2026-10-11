import { AudioLines, Upload } from "lucide-react";

export default function AppHome() {
    return (
        <div className="flex h-full flex-col items-center justify-center gap-8 p-8">
            <AudioLines className="size-24 text-border" />

            <div className="flex max-w-md flex-col items-center gap-4 text-center">
                <h2 className="text-2xl font-semibold text-text">
                    Welcome to Redschnell
                </h2>
                <p className="text-text-muted">
                    Upload audio or video files to get instant transcriptions
                    with speaker detection and timestamps.
                </p>
            </div>

            <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed border-border p-8">
                <Upload className="size-10 text-text-muted" />
                <p className="text-sm text-text-muted">
                    Drag and drop files here, or use the{" "}
                    <span className="font-medium text-accent">Upload</span>{" "}
                    button in the sidebar
                </p>
            </div>
        </div>
    );
}
