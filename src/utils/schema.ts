import { Currency, OrderStatus, Orientation, PaymentMethod } from "@prisma/client";
import { z } from "zod";

// =========== ORDER ===========
const OrderSharedSchema = {
    phoneNumber: z.string().min(10)
}
export const AddOrderSchema = z.object({
    ...OrderSharedSchema,
    artworks: z.array(z.number()),
    paymentMethod: z.nativeEnum(PaymentMethod).default(PaymentMethod.CashOnDelivery),
    screenshotUrl: z.number().nullable()
})
export const AddOrderFormSchema = z.object(
    OrderSharedSchema
)
export const ChangeOrderStatusSchema = z.object({
    id: z.number(),
    orderStatus: z.nativeEnum(OrderStatus)
})

// =========== ARTWORK ===========
const ArtworkSharedSchema = {
    name: z.string().min(2),
    description: z.string().min(2),
    dimension: z.string().min(2),
    featured: z.boolean().default(false),
    availableForSale: z.boolean().default(false),
    price: z.number().default(0),
    currency: z.nativeEnum(Currency).default(Currency.ETB),
    collectionId: z.number().nullable(),
    orientation: z.nativeEnum(Orientation).nullable()
}
export const AddArtworkSchema = z.object({
    ...ArtworkSharedSchema,
    medium: z.array(z.number()).optional(),
    files: z.array(z.number()).optional(),
})
export const AddArtworkFormSchema = z.object({
    ...ArtworkSharedSchema,
    medium: z.array(
        z.object({
            value: z.string(),
            label: z.string(),
            disabled: z.boolean()
        })
    ).optional(),
    files: z.array(z.number()).optional()
    // imageUrl: z.string()
})
export const EditArtworkSchema = z.object({
    ...ArtworkSharedSchema,
    id: z.number(),
    files: z.array(z.number()).optional(),
    medium: z.array(z.number()).optional(),
})
export const EditArtworkFormSchema = z.object({
    ...ArtworkSharedSchema,
    id: z.number(),
    // imageUrl: z.number().nullable().optional(),
    medium: z.array(
        z.object({
            value: z.string(),
            label: z.string(),
            disabled: z.boolean()
        })
    ).nullable(),
    files: z.array(z.number()).optional(),
})

// =========== MEDIA ===========
const MediaSharedSchema = {
    name: z.string().min(2),
    description: z.string().nullable(),
}
export const AddMediaFormSchema = z.object(MediaSharedSchema)
export const EditMediaFormSchema = z.object({
    ...MediaSharedSchema,
    id: z.number(),
})

// =========== COLLECTION ===========
const CollectionSharedSchema = {
    name: z.string().min(2),
    description: z.string().nullable(),
}
export const AddCollectionFormSchema = z.object(CollectionSharedSchema)
export const EditCollectionFormSchema = z.object({
    ...CollectionSharedSchema,
    id: z.number(),
})