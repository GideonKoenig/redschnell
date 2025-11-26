import { eq } from "drizzle-orm";
import { z } from "zod";
import {
    DEFAULT_MODEL,
    transcriptionModelSchema,
} from "~/lib/transcription-models";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { user } from "~/server/db/schema";

const settingsSchema = z.object({
    autoTranscribe: z.boolean().optional(),
    transcriptionModel: transcriptionModelSchema.optional(),
});

const defaultSettings = {
    role: "free",
    autoTranscribe: false,
    transcriptionModel: DEFAULT_MODEL,
} as const;

export const settingsRouter = createTRPCRouter({
    get: protectedProcedure.query(async ({ ctx }) => {
        const result = await ctx.db.query.user.findFirst({
            where: eq(user.id, ctx.session.user.id),
            columns: {
                role: true,
                autoTranscribe: true,
                transcriptionModel: true,
            },
        });

        return result ?? defaultSettings;
    }),

    update: protectedProcedure
        .input(settingsSchema)
        .mutation(async ({ ctx, input }) => {
            await ctx.db
                .update(user)
                .set(input)
                .where(eq(user.id, ctx.session.user.id));

            return { success: true };
        }),
});
