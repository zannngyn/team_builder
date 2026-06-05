import { Class } from "@/types";

export const CLASS_COLORS: Record<Class, string> = {
    "Thiết Y": "#f97316",
    "Toái Mộng": "#3b82f6",
    "Huyết Hà": "#ef4444",
    "Cửu Linh": "#a855f7",
    "Tố Vấn": "#ec4899",
    "Thần Tương": "#f97316",
    "Long Ngâm": "#22c55e",
};

export const CLASSES: Class[] = [
    "Thiết Y",
    "Toái Mộng",
    "Huyết Hà",
    "Cửu Linh",
    "Tố Vấn",
    "Thần Tương",
    "Long Ngâm",
];

export const CLASS_ROLES: Record<Class, "tank" | "dps" | "healer"> = {
    "Thiết Y": "tank",
    "Toái Mộng": "dps",
    "Huyết Hà": "dps",
    "Cửu Linh": "healer",
    "Tố Vấn": "healer",
    "Thần Tương": "dps",
    "Long Ngâm": "dps",
};