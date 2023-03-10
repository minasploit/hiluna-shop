import { z } from "zod";
import {
    adminProcedure,
    createTRPCRouter,
    publicProcedure,
} from "~/server/api/trpc";
import { AddCollectionFormSchema, EditCollectionFormSchema } from "~/utils/schema";

export const collectionRouter = createTRPCRouter({
    getOne: publicProcedure
        .input(z.number())
        .query(async ({ ctx, input }) => {
            const res = await ctx.prisma.collection.findFirst({
                where: {
                    id: input
                }
            })

            return res;
        }),
    list: publicProcedure
        .query(async ({ ctx }) => {
            const res = await ctx.prisma.collection.findMany()

            return res;
        }),
    create: adminProcedure
        .input(AddCollectionFormSchema)
        .mutation(async ({ ctx, input }) => {
            const res = await ctx.prisma.collection.create({
                data: {
                    name: input.name,
                    description: input.description
                }
            });

            return res;
        }),
    edit: adminProcedure
        .input(EditCollectionFormSchema)
        .mutation(async ({ ctx, input }) => {
            const res = await ctx.prisma.collection.update({
                where: {
                    id: input.id
                },
                data: {
                    name: input.name,
                    description: input.description
                }
            });

            return res;
        }),
    delete: adminProcedure
        .input(z.number())
        .mutation(async ({ ctx, input }) => {
            const res = await ctx.prisma.collection.delete({
                where: {
                    id: input
                }
            });

            return res;
        }),
});
