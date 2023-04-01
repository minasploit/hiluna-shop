import { Currency, OrderStatus, PaymentMethod, UserRole } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { sendSMSToUser } from "~/utils/functions";
import {
    adminProcedure,
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { AddOrderSchema, ChangeOrderStatusSchema } from "~/utils/schema";
import { hashId } from "~/utils/hashId";

export const orderRouter = createTRPCRouter({
    create: protectedProcedure
        .input(AddOrderSchema)
        .mutation(async ({ ctx, input }) => {
            const artworksUnavailableForSale = await ctx.prisma.artwork.count({
                where: {
                    id: {
                        in: input.artworks
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
                        in: input.artworks
                    }
                },
                select: {
                    id: true,
                    price: true,
                    currency: true,
                }
            })

            const total = artworks.map(a => a.price).reduce((a, b) => a + b)

            // add new orders to the db
            const order = await ctx.prisma.order.create({
                data: {
                    phoneNumber: input.phoneNumber,
                    orderedById: ctx.session.user.id,
                    paymentMethod: input.paymentMethod,
                    screenshotId: input.screenshotId,
                    totalPrice: total,
                    currency: Currency.ETB,
                    orderStatus: input.paymentMethod == PaymentMethod.CashOnDelivery ? OrderStatus.Ordered : OrderStatus.OrderedAndPaid,
                    OrderedArtworks: {
                        create: artworks.map(artwork => ({
                            price: artwork.price,
                            currency: artwork.currency,
                            artworkId: artwork.id
                        }))
                    }
                }
            });

            // mark the artworks as unavailable for sale
            await ctx.prisma.artwork.updateMany({
                data: {
                    availableForSale: false
                },
                where: {
                    id: {
                        in: input.artworks
                    }
                }
            })

            // send order placed sms to user
            await sendSMSToUser(input.phoneNumber, `${hashId.encode(order.id)} at Hiluna Art`, "shopping_1");

            return order;
        }),
    getOne: protectedProcedure
        .input(z.number())
        .query(async ({ ctx, input }) => {
            const order = await ctx.prisma.order.findFirst({
                include: {
                    OrderedArtworks: {
                        include: {
                            Artwork: {
                                include: {
                                    Files: {
                                        include: {
                                            File: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    OrderedBy: true,
                    Screenshot: true
                },
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
    changeOrderStatus: adminProcedure
        .input(ChangeOrderStatusSchema)
        .mutation(async ({ ctx, input }) => {
            const previousOrderStatus = await ctx.prisma.order.findFirst({
                select: {
                    orderStatus: true
                },
                where: {
                    id: input.id
                }
            });

            const order = await ctx.prisma.order.update({
                where: {
                    id: input.id
                },
                data: {
                    orderStatus: input.orderStatus
                }
            });

            // send sms if the order status goes from ordered to (ordered_and_paid, completed)
            if (previousOrderStatus?.orderStatus == OrderStatus.Ordered && order.orderStatus != OrderStatus.Cancelled)
                await sendSMSToUser(order.phoneNumber, `${order.id} at Hiluna Art`, "shopping");

            return order;
        }),
    list: protectedProcedure
        .query(async ({ ctx }) => {
            const isElevated = ctx.session.user.role == UserRole.ADMIN;

            const res = await ctx.prisma.order.findMany({
                include: {
                    OrderedArtworks: {
                        include: {
                            Artwork: {
                                include: {
                                    Files: {
                                        include: {
                                            File: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    OrderedBy: true,
                    Screenshot: true
                },
                where: isElevated ? {} : {
                    orderedById: ctx.session.user.id
                },
                orderBy: {
                    orderedAt: "desc"
                }
            })

            return res;
        }),
});
