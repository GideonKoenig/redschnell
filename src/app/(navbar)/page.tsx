import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function Home() {
    return (
        <main className="flex h-full w-full flex-col items-center justify-center">
            <div className="flex flex-col gap-10">
                <h1 className="text-6xl font-black drop-shadow-lg">
                    Transcriptions but{" "}
                    <span className="text-accent underline">easy</span>
                    <br />
                    and <span className="text-accent underline">smart</span> !
                </h1>

                <p className="flex flex-col gap-4 drop-shadow">
                    <span className="text-3xl font-bold">
                        Find the information you need.
                    </span>
                    Manage all your recorded meetings, interviews and lectures
                    in one place.
                    <br />
                    Use the power of AI to recall details, find connections
                    between different sources and summarize your transcripts.
                </p>
                <Link className="mx-auto mt-8" href="/app">
                    <Button
                        variant="accent"
                        className="px-4 py-5 drop-shadow-none"
                    >
                        Get started now
                    </Button>
                </Link>
            </div>
        </main>
    );
}
