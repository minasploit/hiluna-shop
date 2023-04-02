import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";

export const favoriteRouter = createTRPCRouter({
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
