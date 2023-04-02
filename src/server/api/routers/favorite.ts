import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";

export const favoriteRouter = createTRPCRouter({
    list: protectedProcedure
        .query(async ({ ctx }) => {
            const res = await ctx.prisma.user.findFirst({
                where: {
                    id: ctx.session.user.id
                },
                include: {
                    Favorites: {
                        include: {
                            Files: {
                                include: {
                                    File: true
                                }
                            },
                            Collection: true,
                            Medium: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            },
                        }
                    }
                },
            });

            return res?.Favorites
        }),
    toggleFavorite: protectedProcedure
        .input(z.number())
        .mutation(async ({ ctx, input }) => {
            const artwork = await ctx.prisma.artwork.findFirst({
                where: {
                    id: input
                },
                select: {
                    FavoritedBy: {
                        select: {
                            id: true
                        }
                    }
                }
            });

            const isAddition = artwork?.FavoritedBy.filter(f => f.id == ctx.session.user.id).length == 0;

            const updatedArtwork = await ctx.prisma.artwork.update({
                where: {
                    id: input
                },
                data: {
                    FavoritedBy: {
                        connect: isAddition ? {
                            id: ctx.session.user.id
                        } : undefined,
                        disconnect: !isAddition ? {
                            id: ctx.session.user.id
                        } : undefined,
                    }
                }
            });

            return updatedArtwork
        }),
});
