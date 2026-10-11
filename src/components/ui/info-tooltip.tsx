"use client";

import { Info } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "~/components/ui/tooltip";

export function InfoTooltip(props: { content: string }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Info className="size-3.5 cursor-help text-text-muted" />
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={4}>
                {props.content}
            </TooltipContent>
        </Tooltip>
    );
}
