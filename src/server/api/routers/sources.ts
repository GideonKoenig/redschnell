import { eq } from "drizzle-orm";
import { z } from "zod";
import { getKeyFromUrl } from "~/lib/uploadthing";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { sources, transcripts } from "~/server/db/schema";
import { utapi } from "~/server/uploadthing";

export const sourcesRouter = createTRPCRouter({
    list: protectedProcedure.query(async ({ ctx }) => {
        return ctx.db.query.sources.findMany({
            where: eq(sources.owner, ctx.session.user.id),
            orderBy: (sources, { desc }) => [desc(sources.createdAt)],
            with: {
                transcript: {
                    columns: {
                        status: true,
                    },
                },
            },
        });
    }),

    get: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(async ({ ctx, input }) => {
            const source = await ctx.db.query.sources.findFirst({
                where: eq(sources.id, input.id),
                with: {
                    transcript: {
                        columns: {
                            status: true,
                        },
                    },
                },
            });

            if (!source || source.owner !== ctx.session.user.id) {
                return null;
            }

            return source;
        }),

    rename: protectedProcedure
        .input(
            z.object({
                id: z.string().uuid(),
                name: z.string().min(1).max(512),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const source = await ctx.db.query.sources.findFirst({
                where: eq(sources.id, input.id),
                columns: { owner: true },
            });

            if (!source || source.owner !== ctx.session.user.id) {
                return { success: false };
            }

            await ctx.db
                .update(sources)
                .set({ name: input.name })
                .where(eq(sources.id, input.id));

            return { success: true };
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            const source = await ctx.db.query.sources.findFirst({
                where: eq(sources.id, input.id),
            });

            if (!source || source.owner !== ctx.session.user.id) {
                return { success: false };
            }

            await Promise.all([
                utapi.deleteFiles(getKeyFromUrl(source.url)),
                ctx.db
                    .delete(transcripts)
                    .where(eq(transcripts.sourceId, source.id)),
                ctx.db.delete(sources).where(eq(sources.id, source.id)),
            ]);

            return { success: true };
        }),
});
