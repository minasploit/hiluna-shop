import { env } from "~/env.mjs"

export function resolveResource(imageUrl: string): string {
    return `https://media.hiluna.art/uploads/${imageUrl}`
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