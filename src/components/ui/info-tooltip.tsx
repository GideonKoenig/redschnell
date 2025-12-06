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
                <Info className="text-text-muted size-3.5 cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={4}>
                {props.content}
            </TooltipContent>
        </Tooltip>
    );
}
