import { type File, FileType, type Artwork } from "@prisma/client"
import { env } from "~/env.mjs"

export function resolveUploadResource(imageUrl: string): string {
    return `https://media.hiluna.art/uploads/${imageUrl}`
}

export function resolveStaticResource(imageUrl: string): string {
    return `https://media.hiluna.art/static/${imageUrl}`
}

export function prettifyCamel(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1 $2').trim()
}

export async function sendSMSToUser(phoneNumber: string, message: string, template_id: "shopping" | "shopping_1") {
    return fetch(env.SMS_GATEWAY_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            token: env.SMS_GATEWAY_API_TOKEN,
            to: phoneNumber,
            message: message,
            template_id: template_id
        }),
    })
}

export function getArtworkImage(artwork: Artwork & {
    Files: File[]
}): string {
    const images = artwork.Files.filter(f => f.fileType == FileType.Image);
    if (!images[0])
        return resolveStaticResource("artworkplaceholder.jpg")

    return resolveUploadResource(images[0].fileUrl)
}