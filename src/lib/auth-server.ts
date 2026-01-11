import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { headers } from "next/headers";
import { db } from "~/server/db";
import * as schema from "~/server/db/schema";
import { env } from "~/env";
import { type Settings } from "~/lib/settings";
import {
    DEFAULT_MODEL,
    transcriptionModelSchema,
} from "~/lib/transcription-models";

export const auth = betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.NEXT_PUBLIC_APP_URL,
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "free",
            },
            autoTranscribe: {
                type: "boolean",
                defaultValue: false,
            },
            transcriptionModel: {
                type: "string",
                defaultValue: DEFAULT_MODEL,
            },
            showTimestamps: {
                type: "boolean",
                defaultValue: true,
            },
            showSpeakers: {
                type: "boolean",
                defaultValue: true,
            },
            removeFillwords: {
                type: "boolean",
                defaultValue: false,
            },
        },
    },
    socialProviders: {
        google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
    },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;

export async function getSession() {
    return auth.api.getSession({ headers: headers() });
}

export async function getUser() {
    const session = await getSession();
    return session?.user ?? null;
}

export function buildSettings(user: User): Settings {
    const parsed = transcriptionModelSchema.safeParse(user.transcriptionModel);
    return {
        role: user.role,
        transcriptionModel: parsed.success ? parsed.data : DEFAULT_MODEL,
        autoTranscribe: user.autoTranscribe,
        showTimestamps: user.showTimestamps,
        showSpeakers: user.showSpeakers,
        removeFillwords: user.removeFillwords,
    };
}
