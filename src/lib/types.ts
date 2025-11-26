import { type RouterOutputs } from "~/trpc/react";

export type Source = NonNullable<RouterOutputs["sources"]["get"]>;
export type SourceWithTranscript = RouterOutputs["sources"]["list"][number];
export type Transcript = RouterOutputs["transcripts"]["get"];
