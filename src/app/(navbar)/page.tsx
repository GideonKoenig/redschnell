import Link from "next/link";
import { ArrowRight, AudioLines } from "lucide-react";
import { Button } from "~/components/ui/button";

// Bar heights in px for the decorative waveform. The first bars are drawn as already played.
const WAVEFORM = [
    10, 18, 26, 14, 30, 22, 12, 28, 34, 20, 16, 24, 32, 18, 10, 22, 30, 26, 14,
    20, 28, 12, 18, 24, 16, 10, 22, 30, 18, 12,
];
const PLAYED_BARS = 12;

const SEGMENTS = [
    {
        speaker: "Anna",
        time: "00:04",
        text: "Okay, I think everyone's here. Should we start with the budget?",
    },
    {
        speaker: "Ben",
        time: "00:09",
        text: "Sure. We're about two thousand over, mostly because of the venue.",
    },
    {
        speaker: "Anna",
        time: "00:16",
        text: "Hm. Can we still switch to the smaller room?",
    },
];

export default function Home() {
    return (
        <main className="flex w-full grow flex-col items-center justify-center px-6 py-16">
            <div className="grid w-full max-w-5xl items-center gap-16 lg:grid-cols-2">
                <div className="flex flex-col items-start gap-6">
                    <h1 className="text-5xl font-black tracking-tight text-balance sm:text-6xl">
                        Turn recordings into{" "}
                        <span className="text-accent">text</span>.
                    </h1>

                    <p className="max-w-xl text-lg text-text-muted">
                        Upload a meeting, interview or lecture and get a
                        transcript with speakers and timestamps. All your
                        recordings stay in one place.
                    </p>

                    <Button asChild variant="accent" size="lg" className="mt-4">
                        <Link href="/app">
                            Get started
                            <ArrowRight />
                        </Link>
                    </Button>
                </div>

                <div aria-hidden className="relative hidden lg:block">
                    <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-lg bg-accent/10" />
                    <div className="relative flex flex-col gap-5 rounded-lg border border-border bg-bg-surface p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-md bg-accent text-white">
                                <AudioLines className="size-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold">
                                    Team Meeting.m4a
                                </span>
                                <span className="text-xs text-text-muted">
                                    10:20
                                </span>
                            </div>
                        </div>

                        <div className="flex h-9 items-center justify-between">
                            {WAVEFORM.map((height, index) => (
                                <span
                                    key={index}
                                    style={{ height }}
                                    className={`w-1 rounded-full ${index < PLAYED_BARS ? "bg-accent" : "bg-accent/25"}`}
                                />
                            ))}
                        </div>

                        <div className="flex flex-col gap-4 border-t border-border pt-5">
                            {SEGMENTS.map((segment) => (
                                <div
                                    key={segment.time}
                                    className="flex flex-col gap-1"
                                >
                                    <div className="flex items-baseline gap-2 text-xs">
                                        <span className="font-semibold">
                                            {segment.speaker}
                                        </span>
                                        <span className="text-text-muted">
                                            {segment.time}
                                        </span>
                                    </div>
                                    <p className="text-sm">{segment.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
