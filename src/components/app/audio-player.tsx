"use client";

import { Pause, Play, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
    type AudioPlayer,
    usePlaybackPosition,
} from "~/hooks/use-audio-player";
import { formatTimestamp } from "~/lib/schemas/transcript";

/** Control bar below the transcript. `fallbackDuration` covers the time before the audio's metadata has loaded. */
export function AudioPlayerBar(props: {
    player: AudioPlayer;
    fallbackDuration: number;
    onClose: () => void;
}) {
    const { player } = props;
    const position = usePlaybackPosition(player.audioRef);
    const duration = position.duration || props.fallbackDuration;

    return (
        <div className="flex shrink-0 items-center gap-2 border-t border-border px-3 py-2">
            <Button
                size="icon-sm"
                variant="ghost"
                title={player.isPlaying ? "Pause" : "Play"}
                onClick={player.isPlaying ? player.pause : player.play}
                // The bar replaces the toolbar's Play button, so keyboard focus moves here.
                autoFocus
            >
                {player.isPlaying ? <Pause /> : <Play />}
            </Button>
            <span className="font-mono text-xs text-text-muted tabular-nums">
                {formatTimestamp(position.currentTime)}
            </span>
            <input
                type="range"
                min={0}
                max={duration}
                step="any"
                value={position.currentTime}
                onChange={(event) => player.seek(Number(event.target.value))}
                aria-label="Seek"
                className="h-1 min-w-0 grow cursor-pointer accent-accent"
            />
            <span className="font-mono text-xs text-text-muted tabular-nums">
                {formatTimestamp(duration)}
            </span>
            <Button
                size="sm"
                variant="ghost"
                title="Playback speed"
                onClick={player.cycleRate}
                className="w-12 font-mono text-xs"
            >
                {player.rate}×
            </Button>
            <Button
                size="icon-sm"
                variant="ghost"
                title="Close player"
                onClick={props.onClose}
            >
                <X />
            </Button>
        </div>
    );
}
