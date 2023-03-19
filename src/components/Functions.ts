export function resolveResource(imageUrl: string): string {
    return `https://media.hiluna.art/uploads/${imageUrl}`
}

export function prettifyCamel(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1 $2').trim()
}