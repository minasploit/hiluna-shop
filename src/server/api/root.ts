import { createTRPCRouter } from "~/server/api/trpc";
import { dashboardRouter } from "./routers/dashboard";
import { mediaRouter } from "./routers/media";
import { artworkRouter } from "./routers/artwork";
import { collectionRouter } from "./routers/collection";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	dashboard: dashboardRouter,
	media: mediaRouter,
	artwork: artworkRouter,
	collection: collectionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
