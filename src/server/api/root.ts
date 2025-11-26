import {
    createCallerFactory,
    createTRPCRouter,
    publicProcedure,
} from "~/server/api/trpc";
import { settingsRouter } from "~/server/api/routers/settings";
import { sourcesRouter } from "~/server/api/routers/sources";
import { transcriptsRouter } from "~/server/api/routers/transcripts";

export const appRouter = createTRPCRouter({
    health: publicProcedure.query(() => "ok"),
    settings: settingsRouter,
    sources: sourcesRouter,
    transcripts: transcriptsRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
