import Link from "next/link";
import { Button } from "~/components/ui/button";
import { NavigationBar } from "~/components/navigation-menu";
import { ScrollArea } from "~/components/ui/scroll-area";
import Arch from "assets/arch.svg";

export default async function Home() {
    return (
        <main className="w-full">
            <ScrollArea type="scroll" className="flex h-screen w-full flex-col">
                <div className="flex h-[calc(100vh-4rem)] flex-col">
                    <NavigationBar className="bg-menu-main dark:bg-dark-menu-main" />
                    <div className="flex flex-grow flex-col items-center justify-center bg-menu-main text-text-normal dark:bg-dark-menu-main dark:text-dark-text-normal">
                        <div className="flex flex-col gap-10">
                            <h1 className="text-6xl font-black drop-shadow-[0px_4px_12px_rgba(0,0,0,0.3)] dark:drop-shadow-[0px_4px_12px_rgba(255,255,255,0.15)]">
                                Transcriptions but{" "}
                                <span className="text-accent-main underline dark:text-dark-accent-light">
                                    easy
                                </span>
                                <br />
                                and{" "}
                                <span className="text-accent-main underline dark:text-dark-accent-light">
                                    smart
                                </span>{" "}
                                !
                            </h1>

                            <p className="flex flex-col gap-4 drop-shadow-[0px_4px_5px_rgba(0,0,0,0.3)] dark:drop-shadow-[0px_4px_7px_rgba(255,255,255,0.3)]">
                                <span className="text-3xl font-bold">
                                    Find the information you need.
                                </span>
                                Manage all your recorded meetings, interviews
                                and lectures in one place.
                                <br />
                                Use the power of AI to recall details, find
                                connections between different sources and
                                summarize your transcripts.
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
                </div>
                <div className="relative w-full bg-menu-light px-4 py-16 dark:bg-dark-menu-light">
                    <Arch className="absolute left-0 top-0 w-full text-menu-main dark:text-dark-menu-main" />

                    <p>
                        Here you can add all the marketing talk that you want.
                    </p>
                </div>
            </ScrollArea>
        </main>
    );
}
