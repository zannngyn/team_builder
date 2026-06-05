import { Class } from "@/types";

export const CLASS_COLORS: Record<Class, string> = {
    "Thiết Y": "#fcba03",
    "Toái Mộng": "#38bdf8",
    "Huyết Hà": "#f00202",
    "Cửu Linh": "#a855f7",
    "Tố Vấn": "#ec4899",
    "Thần Tương": "#1e40af",
    "Long Ngâm": "#22c55e",
    "All": "#ffffff",
};

export const CLASSES: Class[] = [
    "Thiết Y",
    "Toái Mộng",
    "Huyết Hà",
    "Cửu Linh",
    "Tố Vấn",
    "Thần Tương",
    "Long Ngâm",
    "All",
];

export const CLASS_ROLES: Record<Class, "tank" | "dps" | "healer"> = {
    "Thiết Y": "tank",
    "Toái Mộng": "dps",
    "Huyết Hà": "dps",
    "Cửu Linh": "healer",
    "Tố Vấn": "healer",
    "Thần Tương": "dps",
    "Long Ngâm": "dps",
    "All": "dps",
};