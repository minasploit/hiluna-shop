import { OrderStatus, PaymentMethod } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
    createTRPCRouter,
    adminProcedure,
    protectedProcedure,
} from "~/server/api/trpc";
import { AddOrderSchema } from "~/utils/schema";

export const orderRouter = createTRPCRouter({
    create: protectedProcedure
        .input(AddOrderSchema)
        .mutation(async ({ ctx, input }) => {
            const artworksUnavailableForSale = await ctx.prisma.artwork.count({
                where: {
                    id: {
                        in: input.items
                    },
                    availableForSale: false
                }
            })

            if (artworksUnavailableForSale) {
                // order contains artworks unavailable for sale

                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Orders contain an artwork which is not available for sale"
                })
            }

            const res = await ctx.prisma.order.createMany({
                data: input.items.map((i) => {
                    return {
                        phoneNumber: input.phoneNumber,
                        artworkId: i,
                        orderedById: ctx.session.user.id,
                        paymentMethod: input.paymentMethod,
                        screenshotUrl: input.screenshotUrl,
                        orderStatus: input.paymentMethod == PaymentMethod.CashOnDelivery ? OrderStatus.Ordered : OrderStatus.OrderedAndPaid
                    }
                }),
                skipDuplicates: true
            });

            // set the artworks as unavailable for sale

            return res;
        }),
    getOne: adminProcedure
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
});
