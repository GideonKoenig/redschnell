import { eq } from "drizzle-orm";
import { DEFAULT_SETTINGS, settingsSchema } from "~/lib/settings";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { user } from "~/server/db/schema";

export const settingsRouter = createTRPCRouter({
    get: protectedProcedure.query(async ({ ctx }) => {
        const result = await ctx.db.query.user.findFirst({
            where: eq(user.id, ctx.session.user.id),
            columns: {
                role: true,
                autoTranscribe: true,
                transcriptionModel: true,
                showTimestamps: true,
                showSpeakers: true,
            },
        });

        return result ?? DEFAULT_SETTINGS;
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
