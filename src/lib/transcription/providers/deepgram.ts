import { createClient } from "@deepgram/sdk";
import { env } from "~/env";
import { tryCatch, Success, Failure, TryCatchError } from "~/lib/try-catch";
import {
    type TranscribeFunction,
    type TranscriptionResult,
    type TranscriptionChunk,
} from "~/lib/transcription/types";

const client = createClient(env.DEEPGRAM_KEY);

export const transcribeDeepgram: TranscribeFunction = async (
    audioUrl,
    modelId,
    supportsDiarization,
) => {
    const result = await tryCatch(
        client.listen.prerecorded.transcribeUrl(
            { url: audioUrl },
            {
                model: modelId,
                smart_format: true,
                diarize: supportsDiarization,
                punctuate: true,
                utterances: true,
            },
        ),
    );

    if (!result.success) return result;

    const response = result.data.result;
    if (!response) {
        return new Failure(
            new TryCatchError(
                "Transcription Error",
                "No result returned from Deepgram",
            ),
        );
    }

    const alternative = response.results?.channels?.[0]?.alternatives?.[0];
    if (!alternative) {
        return new Failure(
            new TryCatchError(
                "Transcription Error",
                "No transcription alternatives found",
            ),
        );
    }

    const chunks: TranscriptionChunk[] = [];

    if (response.results?.utterances) {
        for (const utterance of response.results.utterances) {
            chunks.push({
                start: utterance.start,
                end: utterance.end,
                text: utterance.transcript.trim(),
                speaker:
                    utterance.speaker !== undefined
                        ? `Speaker ${utterance.speaker}`
                        : null,
            });
        }
    } else if (alternative.words) {
        let currentChunk: TranscriptionChunk | null = null;

        for (const word of alternative.words) {
            const speaker =
                word.speaker !== undefined ? `Speaker ${word.speaker}` : null;

            if (!currentChunk || currentChunk.speaker !== speaker) {
                if (currentChunk) {
                    chunks.push(currentChunk);
                }
                currentChunk = {
                    start: word.start,
                    end: word.end,
                    text: word.punctuated_word ?? word.word,
                    speaker,
                };
            } else {
                currentChunk.end = word.end;
                currentChunk.text += " " + (word.punctuated_word ?? word.word);
            }
        }

        if (currentChunk) {
            chunks.push(currentChunk);
        }
    }

    return new Success({
        text: alternative.transcript,
        chunks,
    });
};
