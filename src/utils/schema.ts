import { z } from "zod";

export const AddMediaFormSchema = z.object({
    name: z.string().min(2),
    description: z.string().min(2),
})

export const AddArtworkFormSchema = z.object({
    name: z.string().min(2),
    description: z.string().min(2),
    dimension: z.string().min(2),
    featured: z.boolean().default(false),
    availableForSale: z.boolean().default(false),
    price: z.number().default(0),
    currency: z.enum(["ETB", "USD"]).default("ETB"),
    collectionId: z.number().nullable(),
    orientation: z.enum(["Portrait", "Landscape"]).nullable()
})