import { Lane, MemberTag } from "@/types";

export const LANES: Lane[] = ["Top", "Mid", "Bot", "Flex"];

export const LANE_COLORS: Record<Lane, string> = {
    Top: "#3b82f6", // blue
    Mid: "#a855f7", // purple
    Bot: "#ec4899", // pink
    Flex: "#64748b", // slate
};

export const MEMBER_TAGS: MemberTag[] = [
    "Commander",
    "Caller",
    "Resource Team",
    "Carry",
    "Substitute",
];