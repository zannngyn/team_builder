export type Class =
    | "Thiết Y"
    | "Toái Mộng"
    | "Huyết Hà"
    | "Cửu Linh"
    | "Tố Vấn"
    | "Thần Tương"
    | "Long Ngâm"
    | "All";

export type Lane = "Top" | "Mid" | "Bot" | "Flex";

export type MemberTag =
    | "Commander"
    | "Caller"
    | "Resource Team"
    | "Carry"
    | "Substitute";

export interface Member {
    id: string;
    name: string;
    class: Class | null;
    lane: Lane | null;
    tags: MemberTag[];
    notes: string;
    skills: string[]; // Array of skill IDs, max 3
}
