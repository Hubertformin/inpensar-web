import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId({length: 24});

export function generateUID(prefix: string): string {
    return `${prefix}_${uid()}`;
}