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
            const res = await ctx.prisma.artwork.findFirst({
                where: {
                    id: input,
                },
                include: {
                    Medium: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    Files: true
                }
            })

            return res;
        }),
    getMany: publicProcedure
        .input(z.array(z.number()))
        .query(async ({ ctx, input }) => {
            const res = await ctx.prisma.artwork.findMany({
                include: {
                    Files: true,
                    Collection: true
                },
                where: {
                    id: {
                        in: input
                    }
                }
            })

            return res;
        }),
    getFavorites: publicProcedure
        .query(async ({ ctx }) => {
            const res = await ctx.prisma.artwork.findMany({
                where: {
                    featured: true
                },
                include: {
                    Files: true
                }
            })

            return res;
        }),
    getCartItems: publicProcedure
        .input(z.array(z.number()))
        .query(async ({ ctx, input }) => {
            const res = await ctx.prisma.artwork.findMany({
                where: {
                    id: {
                        in: input
                    }
                },
                select: {
                    id: true,
                    price: true
                }
            })

            return res;
        }),
    list: publicProcedure
        .query(async ({ ctx }) => {
            const res = await ctx.prisma.artwork.findMany({
                include: {
                    Files: true,
                    Collection: true,
                    Medium: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            })

            return res;
        }),
    create: adminProcedure
        .input(AddArtworkSchema)
        .mutation(async ({ ctx, input }) => {
            const artwork = {
                ...input,
                createdById: ctx.session.user.id,
                collectionId: input.collectionId == 0 ? null : input.collectionId,
            };

            delete artwork.medium;
            delete artwork.files;

            const res = await ctx.prisma.artwork.create({
                data: {
                    ...artwork,
                    Medium: {
                        connect: input.medium?.map(m => ({ id: m }))
                    },
                    Files: {
                        connect: input.files?.map(f => ({ id: f }))
                    }
                }
            });

            return res;
        }),
    edit: adminProcedure
        .input(EditArtworkSchema)
        .mutation(async ({ ctx, input }) => {
            const artwork = {
                ...input,
                createdById: ctx.session.user.id,
                collectionId: input.collectionId == 0 ? null : input.collectionId
            }

            delete artwork.medium;
            delete artwork.files;

            const res = await ctx.prisma.artwork.update({
                where: {
                    id: input.id
                },
                include: {
                    Medium: true
                },
                data: {
                    ...artwork,
                    Medium: {
                        set: input.medium?.map(m => ({ id: m }))
                    },
                    Files: {
                        set: input.files?.map(f => ({ id: f }))
                    }
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
