import { Currency, OrderStatus, PaymentMethod, UserRole } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
    createTRPCRouter,
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

            // get price and currency
            const artworks = await ctx.prisma.artwork.findMany({
                where: {
                    id: {
                        in: input.items
                    }
                },
                select: {
                    id: true,
                    price: true,
                    currency: true,
                }
            })

            const res = await ctx.prisma.order.createMany({
                data: input.items.map((i) => {
                    return {
                        phoneNumber: input.phoneNumber,
                        artworkId: i,
                        orderedById: ctx.session.user.id,
                        paymentMethod: input.paymentMethod,
                        screenshotUrl: input.screenshotUrl,
                        price: (artworks.filter(a => a.id == i)[0])?.price ?? 0,
                        currency: (artworks.filter(a => a.id == i)[0])?.currency ?? Currency.ETB,
                        orderStatus: input.paymentMethod == PaymentMethod.CashOnDelivery ? OrderStatus.Ordered : OrderStatus.OrderedAndPaid
                    }
                }),
                skipDuplicates: true
            });

            // set the artworks as unavailable for sale
            await ctx.prisma.artwork.updateMany({
                data: {
                    availableForSale: false
                },
                where: {
                    id: {
                        in: input.items
                    }
                }
            })

            return res;
        }),
    getOne: protectedProcedure
        .input(z.number())
        .query(async ({ ctx, input }) => {
            const order = await ctx.prisma.order.findFirst({
                where: {
                    id: input
                }
            });

            if (ctx.session.user.role == UserRole.USER && order?.orderedById != ctx.session.user.id) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You are not authorized to view this order."
                })
            }

            return order;
        }),
    list: protectedProcedure
        .query(async ({ ctx }) => {
            if (ctx.session.user.role == UserRole.USER) {
                const res = await ctx.prisma.order.findMany({
                    include: {
                        Artwork: true,
                        OrderedBy: true
                    },
                    where: {
                        orderedById: ctx.session.user.id
                    }
                })

                return res
            }

            const res = await ctx.prisma.order.findMany({
                include: {
                    Artwork: true,
                    OrderedBy: true
                }
            })

            return res;
        }),
});
