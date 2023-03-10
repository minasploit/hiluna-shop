import { z } from "zod";

// ARTWORK
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
    imageUrl: z.string().min(2),
})
export const AddArtworkFormSchema = z.object(ArtworkSharedSchema)

// MEDIA
const MediaSharedSchema = {
    name: z.string().min(2),
    description: z.string().nullable(),
}
export const AddMediaFormSchema = z.object(MediaSharedSchema)
export const EditMediaFormSchema = z.object({
    id: z.number(),
    ...MediaSharedSchema
})

// COLLECTION
const CollectionSharedSchema = {
    name: z.string().min(2),
    description: z.string().nullable(),
}
export const AddCollectionFormSchema = z.object(CollectionSharedSchema)
export const EditCollectionFormSchema = z.object({
    id: z.number(),
    ...CollectionSharedSchema
})