import { type File, FileType, type Artwork, type ArtworkFiles } from "@prisma/client"
import { env } from "~/env.mjs"

export function resolveUploadResource(imageUrl: string | null | undefined): string {
    if (imageUrl == null || imageUrl == undefined)
        return ""

    return `https://media.hiluna.art/uploads/${imageUrl}`
}

export function resolveStaticResource(imageUrl: string | null | undefined): string {
    if (imageUrl == null || imageUrl == undefined)
        return ""

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
    Files: (ArtworkFiles & {
        File: File;
    })[]
}): {
    File: File;
    type: "upload" | "static";
} {
    const images = artwork.Files.filter(f => f.File.fileType == FileType.Image);
    if (!images[0])
        return {
            type: "static",
            File: {
                id: 0,
                fileUrl: "artworkplaceholder.jpg",
                fileType: FileType.Image,
                mimeType: "image/*",
                blurHash: null
            }
        }

    return {
        ...images[0],
        type: "upload"
    }
}

export function getArtworkImageUrl(artwork: Artwork & {
    Files: (ArtworkFiles & {
        File: File;
    })[]
}): string {
    const image = getArtworkImage(artwork);

    if (image.type == "static") {
        return resolveStaticResource("artworkplaceholder.jpg")
    }

    return resolveUploadResource(image.File.fileUrl)
}

export const splitStringByLength = (str: string, length: number) => str.match(new RegExp(`.{1,${length}}`, 'g'));
