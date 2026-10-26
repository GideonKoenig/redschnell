"use client";

import { type RefObject, useRef, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";

const RATES = [1, 1.5, 2] as const;

export type AudioPlayer = ReturnType<typeof useAudioPlayer>;

/**
 * Controls for one recording. Spread `audioProps` onto an `<audio>` element to connect it.
 * The playback position is not React state here, so the component owning the player doesn't re-render on every tick.
 * Read it with `usePlaybackPosition` where it is displayed.
 */
export function useAudioPlayer(src: string) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [rate, setRate] = useState<(typeof RATES)[number]>(1);

    const audioProps = {
        ref: audioRef,
        src,
        preload: "none",
        onPlay: () => setIsPlaying(true),
        onPause: () => setIsPlaying(false),
    } satisfies React.ComponentProps<"audio">;

    const play = () => {
        audioRef.current?.play().catch((error: unknown) => {
            // A pause during loading aborts the pending play; that isn't a failure.
            if (error instanceof DOMException && error.name === "AbortError")
                return;
            toast.error("Could not play the recording");
        });
    };

    const pause = () => audioRef.current?.pause();

    const seek = (time: number) => {
        if (audioRef.current) audioRef.current.currentTime = time;
    };

    const cycleRate = () => {
        const next = RATES[(RATES.indexOf(rate) + 1) % RATES.length]!;
        if (audioRef.current) audioRef.current.playbackRate = next;
        setRate(next);
    };

    return {
        audioRef,
        audioProps,
        isPlaying,
        rate,
        play,
        pause,
        seek,
        cycleRate,
    };
}

/** Current time and duration of the audio element, updated on every playback tick. */
export function usePlaybackPosition(
    audioRef: RefObject<HTMLAudioElement | null>,
) {
    const subscribe = (onChange: () => void) => {
        const audio = audioRef.current;
        audio?.addEventListener("timeupdate", onChange);
        audio?.addEventListener("durationchange", onChange);
        return () => {
            audio?.removeEventListener("timeupdate", onChange);
            audio?.removeEventListener("durationchange", onChange);
        };
    };

    const currentTime = useSyncExternalStore(
        subscribe,
        () => audioRef.current?.currentTime ?? 0,
        () => 0,
    );
    // NaN until the metadata has loaded.
    const duration = useSyncExternalStore(
        subscribe,
        () => audioRef.current?.duration ?? Number.NaN,
        () => Number.NaN,
    );

    return { currentTime, duration };
}
