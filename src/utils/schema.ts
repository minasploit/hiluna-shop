import { z } from "zod";

// =========== ORDER ===========
const OrderSharedSchema = {
    phoneNumber: z.string().min(10)
}
export const AddOrderSchema = z.object({
    ...OrderSharedSchema,
    artworks: z.array(z.number()),
    paymentMethod: z.enum(["CashOnDelivery", "CBE", "Telebirr", "Bunna"]).default("CashOnDelivery"),
    screenshotUrl: z.string().nullable()
})
export const AddOrderFormSchema = z.object(
    OrderSharedSchema
)
export const ChangeOrderStatusSchema = z.object({
    id: z.number(),
    orderStatus: z.enum(["Ordered", "OrderedAndPaid", "Cancelled", "Completed"])
})

// =========== ARTWORK ===========
const ArtworkSharedSchema = {
    name: z.string().min(2),
    description: z.string().min(2),
    dimension: z.string().min(2),
    featured: z.boolean().default(false),
    availableForSale: z.boolean().default(false),
    price: z.number().default(0),
    currency: z.enum(["ETB", "USD"]).default("ETB"),
    collectionId: z.number().nullable(),
    orientation: z.enum(["Portrait", "Landscape"]).nullable()
}
export const AddArtworkSchema = z.object({
    ...ArtworkSharedSchema,
    medium: z.array(z.number()).optional(),
    imageUrl: z.string().min(2),
})
export const AddArtworkFormSchema = z.object({
    ...ArtworkSharedSchema,
    medium: z.array(
        z.object({
            value: z.string(),
            label: z.string(),
            disabled: z.boolean()
        })
    ),
    // imageUrl: z.string()
})
export const EditArtworkSchema = z.object({
    ...ArtworkSharedSchema,
    id: z.number(),
    imageUrl: z.string(),
    medium: z.array(z.number()).optional(),
})
export const EditArtworkFormSchema = z.object({
    ...ArtworkSharedSchema,
    id: z.number(),
    imageUrl: z.string().nullable().optional(),
    medium: z.array(
        z.object({
            value: z.string(),
            label: z.string(),
            disabled: z.boolean()
        })
    ).nullable(),
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