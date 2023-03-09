import {
    createTRPCRouter,
    adminProcedure,
    publicProcedure,
} from "~/server/api/trpc";
import { AddArtworkFormSchema } from "~/utils/schema";

export const artworkRouter = createTRPCRouter({
    create: adminProcedure
        .input(AddArtworkFormSchema)
        .mutation(async ({ ctx, input }) => {
            const res = await ctx.prisma.artwork.create({
                data: {
                    ...input,
                    imageUrl: "",
                    createdById: ctx.session.user.id,
                    collectionId: input.collectionId == 0 ? null : input.collectionId
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
