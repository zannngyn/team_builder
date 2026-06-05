import { Member, Class } from "@/types";

/**
 * Parse pasted text into member names
 * Handles multiple formats: line-separated, comma-separated, etc.
 */
export function parseRosterText(text: string): string[] {
    if (!text.trim()) return [];

    // Split by newlines first
    const lines = text.split(/\r?\n/);

    const names: string[] = [];

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // Check if line contains commas (comma-separated format)
        if (trimmed.includes(",")) {
            const commaSeparated = trimmed.split(",").map((n) => n.trim()).filter(Boolean);
            names.push(...commaSeparated);
        } else {
            names.push(trimmed);
        }
    }

    // Remove duplicates while preserving order
    return Array.from(new Set(names));
}

export interface ParsedPlayer {
    name: string;
    class: Class | null;
}

/**
 * Parse roster text containing player names and their class names or abbreviations.
 * e.g., "ThiênMa - Thiết Y", "VôDanh (TY)", "CôĐộcKiếm TM"
 */
export function parseRosterTextWithClass(text: string): ParsedPlayer[] {
    if (!text.trim()) return [];

    const lines = text.split(/\r?\n/);
    const parsedPlayers: ParsedPlayer[] = [];
    const seenNames = new Set<string>();

    const classMap: Record<string, Class> = {
        "thiết y": "Thiết Y", "ty": "Thiết Y",
        "toái mộng": "Toái Mộng", "tm": "Toái Mộng",
        "huyết hà": "Huyết Hà", "hh": "Huyết Hà",
        "cửu linh": "Cửu Linh", "cl": "Cửu Linh",
        "tố vấn": "Tố Vấn", "tv": "Tố Vấn",
        "thần tương": "Thần Tương", "tt": "Thần Tương",
        "long ngâm": "Long Ngâm", "ln": "Long Ngâm"
    };

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        let name = trimmed;
        let matchedClass: Class | null = null;

        // Check if line contains common separators: -, |, (, [, tab
        const separatorRegex = /[-|\t\(\[\]]/;
        if (separatorRegex.test(trimmed)) {
            const parts = trimmed.split(/[-|\t\(\[\]]/).map(p => p.trim()).filter(Boolean);
            if (parts.length >= 2) {
                const potentialClass = parts[parts.length - 1].toLowerCase();
                if (classMap[potentialClass]) {
                    matchedClass = classMap[potentialClass];
                    name = parts.slice(0, parts.length - 1).join(" ").trim();
                }
            }
        } else {
            // No explicit separator, check if it ends with a space and a class/abbreviation
            const lastSpaceIndex = trimmed.lastIndexOf(" ");
            if (lastSpaceIndex !== -1) {
                const potentialClass = trimmed.substring(lastSpaceIndex + 1).toLowerCase();
                if (classMap[potentialClass]) {
                    matchedClass = classMap[potentialClass];
                    name = trimmed.substring(0, lastSpaceIndex).trim();
                }
            }
        }

        // Clean up name trailing commas or semicolons
        name = name.replace(/[,;]+$/, "").trim();

        if (name && !seenNames.has(name.toLowerCase())) {
            seenNames.add(name.toLowerCase());
            parsedPlayers.push({
                name,
                class: matchedClass
            });
        }
    }

    return parsedPlayers;
}

/**
 * Validate member name
 */
export function isValidMemberName(name: string): boolean {
    return name.trim().length > 0 && name.trim().length <= 50;
}

/**
 * Validate formation name
 */
export function isValidFormationName(name: string): boolean {
    return name.trim().length > 0 && name.trim().length <= 100;
}