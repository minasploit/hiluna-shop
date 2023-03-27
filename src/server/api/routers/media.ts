import { z } from "zod";
import {
    createTRPCRouter,
    adminProcedure,
    publicProcedure,
} from "~/server/api/trpc";
import { AddMediaFormSchema, EditMediaFormSchema } from "~/utils/schema";

export const mediaRouter = createTRPCRouter({
    getOne: publicProcedure
        .input(z.number())
        .query(async ({ ctx, input }) => {
            const res = await ctx.prisma.media.findFirst({
                where: {
                    id: input
                }
            })

            return res;
        }),
    list: publicProcedure
        .query(async ({ ctx }) => {
            const res = await ctx.prisma.media.findMany()

            return res;
        }),
    listForFilter: publicProcedure.query(async ({ ctx }) => {
        const res = await ctx.prisma.media.findMany({
            select: {
                id: true,
                name: true
            }
        })

        return res
    }),
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
    edit: adminProcedure
        .input(EditMediaFormSchema)
        .mutation(async ({ ctx, input }) => {
            const res = await ctx.prisma.media.update({
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
            const res = await ctx.prisma.media.delete({
                where: {
                    id: input
                }
            });

            return res;
        }),
});
