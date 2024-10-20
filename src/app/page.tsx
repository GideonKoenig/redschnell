import Link from "next/link";
import { Button } from "~/components/ui/button";
import { NavigationBar } from "~/components/ui/navigation-menu";

export default async function Home() {
    return (
        <main className="flex h-full w-full flex-col">
            <NavigationBar className="bg-menu-main dark:bg-dark-menu-main" />
            <div className="bg-menu-main dark:bg-dark-menu-main text-text-normal dark:text-dark-text-normal flex flex-grow flex-col items-center justify-center">
                <div className="flex flex-col gap-10">
                    <h1 className="text-6xl font-black drop-shadow-[0px_4px_12px_rgba(0,0,0,0.3)] dark:drop-shadow-[0px_4px_12px_rgba(255,255,255,0.3)]">
                        Transcriptions but{" "}
                        <span className="text-accent-main dark:text-dark-accent-light underline">
                            easy
                        </span>
                        <br />
                        and{" "}
                        <span className="text-accent-main dark:text-dark-accent-light underline">
                            smart
                        </span>{" "}
                        !
                    </h1>

                    <p className="flex flex-col gap-4 drop-shadow-[0px_4px_5px_rgba(0,0,0,0.3)] dark:drop-shadow-[0px_4px_7px_rgba(255,255,255,0.3)]">
                        <span className="text-3xl font-bold">
                            Find the information you need.
                        </span>
                        Manage all your recorded meetings, interviews and
                        lectures in one place.
                        <br />
                        Use the power of AI to recall details, find connections
                        between different sources and summarize your
                        transcripts.
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
            </div>
        </main>
    );
}
