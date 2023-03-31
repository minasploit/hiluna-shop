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
                },
                include: {
                    FeatureImage: true
                }
            })

            return res;
        }),
    list: publicProcedure
        .query(async ({ ctx }) => {
            const res = await ctx.prisma.media.findMany({
                include: {
                    FeatureImage: true
                }
            })

            return res;
        }),
    listFeatured: publicProcedure
        .query(async ({ ctx }) => {
            const res = await ctx.prisma.media.findMany({
                include: {
                    FeatureImage: true
                },
                where: {
                    featured: true
                },
                orderBy: {
                    featureOrder: "desc"
                }
            })

            return res;
        }),
    listForFilter: publicProcedure.query(async ({ ctx }) => {
        const res = await ctx.prisma.media.findMany({
            select: {
                id: true,
                name: true
            },
            orderBy: {
                featureOrder: "desc"
            }
        })

        return res
    }),
    create: adminProcedure
        .input(AddMediaFormSchema)
        .mutation(async ({ ctx, input }) => {
            const res = await ctx.prisma.media.create({
                data: {
                    ...input
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
                    ...input
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
