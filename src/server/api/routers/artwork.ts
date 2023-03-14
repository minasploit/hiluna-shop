import { z } from "zod";
import {
    createTRPCRouter,
    adminProcedure,
    publicProcedure,
} from "~/server/api/trpc";
import { AddArtworkSchema, EditArtworkSchema } from "~/utils/schema";

export const artworkRouter = createTRPCRouter({
    getOne: publicProcedure
        .input(z.number())
        .query(async ({ ctx, input }) => {
            console.log(input);
            
            const res = await ctx.prisma.artwork.findFirst({
                where: {
                    id: input
                }
            })

            return res;
        }),
    getMany: publicProcedure
        .input(z.array(z.number()))
        .query(async ({ ctx, input }) => {
            const res = await ctx.prisma.artwork.findMany({
                where: {
                    id: {
                        in: input
                    }
                }
            })

            return res;
        }),
    list: publicProcedure
        .query(async ({ ctx }) => {
            const res = await ctx.prisma.artwork.findMany({
                include: {
                    Collection: true
                }
            })

            return res;
        }),
    create: adminProcedure
        .input(AddArtworkSchema)
        .mutation(async ({ ctx, input }) => {
            const res = await ctx.prisma.artwork.create({
                data: {
                    ...input,
                    createdById: ctx.session.user.id,
                    collectionId: input.collectionId == 0 ? null : input.collectionId
                }
            });

            return res;
        }),
    edit: adminProcedure
        .input(EditArtworkSchema)
        .mutation(async ({ ctx, input }) => {
            const res = await ctx.prisma.artwork.update({
                where: {
                    id: input.id
                },
                data: {
                    ...input,
                    createdById: ctx.session.user.id,
                    collectionId: input.collectionId == 0 ? null : input.collectionId
                }
            });

            return res;
        }),
    delete: adminProcedure
        .input(z.number())
        .mutation(async ({ ctx, input }) => {
            const res = await ctx.prisma.artwork.delete({
                where: {
                    id: input
                }
            });

            return res;
        }),
});
