import {
    createTRPCRouter,
    adminProcedure,
} from "~/server/api/trpc";

export const dashboardRouter = createTRPCRouter({
    getDashboardNumbers: adminProcedure.query(async ({ ctx }) => {
        const [artworkCount, collectionCount, mediumCount, userCount] = await Promise.all([
            ctx.prisma.artwork.count(),
            ctx.prisma.collection.count(),
            ctx.prisma.media.count(),
            ctx.prisma.user.count(),
        ])

        return {
            artworkCount,
            mediumCount,
            collectionCount,
            userCount
        };
    }),
});
