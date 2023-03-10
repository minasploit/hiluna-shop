import {
    createTRPCRouter,
    publicProcedure,
} from "~/server/api/trpc";

export const collectionRouter = createTRPCRouter({
    list: publicProcedure
        .query(async ({ ctx }) => {
            const res = await ctx.prisma.collection.findMany()

            return res;
        }),
});
