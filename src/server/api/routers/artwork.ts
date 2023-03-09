import {
    createTRPCRouter,
    adminProcedure,
    publicProcedure,
} from "~/server/api/trpc";
import { AddArtworkSchema } from "~/utils/schema";

export const artworkRouter = createTRPCRouter({
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
    list: publicProcedure
        .query(async ({ ctx }) => {
            const res = await ctx.prisma.artwork.findMany()

            return res;
        }),
});
