import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { dashboardRouter } from "./routers/dashboard";
import { mediaRouter } from "./routers/media";
import { artworkRouter } from "./routers/artwork";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	example: exampleRouter,
	dashboard: dashboardRouter,
	media: mediaRouter,
	artwork: artworkRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
