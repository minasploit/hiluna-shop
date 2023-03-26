import { OrderStatus } from "@prisma/client";
import {
    createTRPCRouter,
    adminProcedure,
} from "~/server/api/trpc";

export const dashboardRouter = createTRPCRouter({
    getDashboardNumbers: adminProcedure.query(async ({ ctx }) => {
        const [artworkCount, collectionCount, orderCount, mediumCount, userCount, activeOrderCount] = await Promise.all([
            ctx.prisma.artwork.count(),
            ctx.prisma.collection.count(),
            ctx.prisma.order.count(),
            ctx.prisma.media.count(),
            ctx.prisma.user.count(),
            ctx.prisma.order.count({
                where: {
                    orderStatus: {
                        in: [OrderStatus.Ordered, OrderStatus.OrderedAndPaid]
                    }
                }
            })
        ])

        const orders = await ctx.prisma.order.findMany({
            where: {
                orderStatus: {
                    in: [OrderStatus.OrderedAndPaid, OrderStatus.Completed]
                }
            }
        })

        const revenue = orders
            .map(order => order.totalPrice)
            .reduce((acc, val) => acc + val, 0)

        return {
            artworkCount,
            mediumCount,
            orderCount,
            collectionCount,
            userCount,
            revenue,
            activeOrderCount
        };
    }),
});
