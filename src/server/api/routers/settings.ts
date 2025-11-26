import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { user } from "~/server/db/schema";

const settingsSchema = z.object({
    autoTranscribe: z.boolean().optional(),
});

const defaultSettings = {
    role: "free",
    autoTranscribe: false,
} as const;

export const settingsRouter = createTRPCRouter({
    get: protectedProcedure.query(async ({ ctx }) => {
        const result = await ctx.db.query.user.findFirst({
            where: eq(user.id, ctx.session.user.id),
            columns: {
                role: true,
                autoTranscribe: true,
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
