import {
    createTRPCRouter,
    adminProcedure,
    publicProcedure,
} from "~/server/api/trpc";
import { AddMediaFormSchema } from "~/utils/schema";

export const mediaRouter = createTRPCRouter({
    create: adminProcedure
        .input(AddMediaFormSchema)
        .mutation(async ({ ctx, input }) => {
            const res = await ctx.prisma.media.create({
                data: {
                    name: input.name,
                    description: input.description
                }
            });

            return res;
        }),
    list: publicProcedure
        .query(async ({ ctx }) => {
            const res = await ctx.prisma.media.findMany()

            return res;
        }),
});
