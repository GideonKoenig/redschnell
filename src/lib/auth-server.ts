import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { headers } from "next/headers";
import { db } from "~/server/db";
import * as schema from "~/server/db/schema";
import { env } from "~/env";
import { DEFAULT_MODEL } from "~/lib/transcription-models";

export const auth = betterAuth({
    secret: env.BETTER_AUTH_SECRET,
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
