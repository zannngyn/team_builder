import { Class } from "@/types/member";

export interface Skill {
    id: string;
    name: string;
    icon: string;
    class: Class | "All";
}

// Universal skills that all classes can use
export const UNIVERSAL_SKILLS: Skill[] = [
    {
        id: "gentle-blessing",
        name: "Gentle Blessing",
        icon: "/skills/gentle-blessing.png",
        class: "All"
    },
    {
        id: "rise-of-the-blade",
        name: "Rise of the Blade",
        icon: "/skills/rise-of-the-blade.png",
        class: "All"
    },
    {
        id: "mist-sweeper",
        name: "Mist Sweeper",
        icon: "/skills/mist-sweeper.png",
        class: "All"
    },
    {
        id: "melodic-blossom",
        name: "Melodic Blossom",
        icon: "/skills/melodic-blossom.png",
        class: "All"
    },
    {
        id: "perfect-precision",
        name: "Perfect Precision",
        icon: "/skills/perfect-precision.png",
        class: "All"
    },
    {
        id: "ex-carefree-petals",
        name: "EX Carefree Petals",
        icon: "/skills/ex-carefree-petals.png",
        class: "All"
    },
    {
        id: "ex-drunken-world",
        name: "EX Drunken World",
        icon: "/skills/ex-drunken-world.png",
        class: "All"
    },
    {
        id: "ex-unstoppable-barrage",
        name: "EX Unstoppable Barrage",
        icon: "/skills/ex-unstoppable-barrage.png",
        class: "All"
    },
    {
        id: "ex-snowlit-gleam",
        name: "EX Snowlit Gleam",
        icon: "/skills/ex-snowlit-gleam.png",
        class: "All"
    },
    {
        id: "reflective-insight",
        name: "Reflective Insight",
        icon: "/skills/reflective-insight.png",
        class: "All"
    },
    {
        id: "featherlight-steps",
        name: "Featherlight Steps",
        icon: "/skills/featherlight-steps.png",
        class: "All"
    },
    {
        id: "ex-flowing-paint",
        name: "EX Flowing Paint",
        icon: "/skills/ex-flowing-paint.png",
        class: "All"
    },
    {
        id: "cai-the-quyet",
        name: "Cái Thế Quyết",
        icon: "/skills/CaiTheQuyet.png",
        class: "All"
    },
    {
        id: "cuu-thien-loi-dan",
        name: "Cửu Thiên Lôi Dẫn",
        icon: "/skills/CuuThienLoiDan.png",
        class: "All"
    },
    {
        id: "doat-phach-bao-dien",
        name: "Đoạt Phách Bảo Điển",
        icon: "/skills/DoatPhachBaoDien.png",
        class: "All"
    },
    {
        id: "hong-lien-phan-da",
        name: "Hồng Liên Phần Dạ",
        icon: "/skills/HongLienPhanDa.png",
        class: "All"
    },
    {
        id: "khai",
        name: "Khai",
        icon: "/skills/khai.png",
        class: "All"
    },
    {
        id: "kiem-pha-can-khon",
        name: "Kiếm Phá Càn Khôn",
        icon: "/skills/KiemPhaCanKhon.png",
        class: "All"
    },
    {
        id: "phon-hoa-nhat-mong",
        name: "Phồn Hoa Nhất Mộng",
        icon: "/skills/PhonHoaNhatMong.png",
        class: "All"
    },
    {
        id: "quan-thien-hao-y",
        name: "Quân Thiên Hạo Ý",
        icon: "/skills/QuanThienHaoY.png",
        class: "All"
    },
    {
        id: "tam-tuyet-kiem",
        name: "Tam Tuyệt Kiếm",
        icon: "/skills/TamTuyetKiem.png",
        class: "All"
    },
    {
        id: "thai-cuc-do",
        name: "Thái Cực Đồ",
        icon: "/skills/ThaiCucDo.png",
        class: "All"
    },
    {
        id: "thien-ha-vo-cau",
        name: "Thiên Hạ Vô Câu",
        icon: "/skills/ThienHaVoCau.png",
        class: "All"
    },
    {
        id: "truong-ca-hien-quan",
        name: "Trường Ca Hiến Quân",
        icon: "/skills/TruongCaHienQuan.png",
        class: "All"
    },
    {
        id: "van-kiem-quyet",
        name: "Vạn Kiếm Quyết",
        icon: "/skills/VanKiemQuyet.png",
        class: "All"
    },
    {
        id: "xuan-hoa-huu-the",
        name: "Xuân Hoa Hựu Thể",
        icon: "/skills/XuanHoaHuuThe.png",
        class: "All"
    }
];

// Skills grouped by class
export const SKILLS: Record<Class, Skill[]> = {
    "Thiết Y": [
        { id: "thiet_y_1", name: "Thiết Y Skill 1", icon: "/skills/thiết_y_1.png", class: "Thiết Y" },
        { id: "thiet_y_2", name: "Thiết Y Skill 2", icon: "/skills/thiết_y_2.png", class: "Thiết Y" },
        { id: "thiet_y_3", name: "Thiết Y Skill 3", icon: "/skills/thiết_y_3.png", class: "Thiết Y" },

    ],
    "Toái Mộng": [
        { id: "phi_tinh", name: "Phi Tinh", icon: "/skills/phi_tinh.png", class: "Toái Mộng" },
        { id: "toai_mong_2", name: "Toái Mộng Skill 2", icon: "/skills/toai_mong_2.png", class: "Toái Mộng" },
        { id: "toai_mong_3", name: "Toái Mộng Skill 3", icon: "/skills/toai_mong_3.png", class: "Toái Mộng" },

    ],
    "Huyết Hà": [
        { id: "huyet_ha_1", name: "Huyết Hà Skill 1", icon: "/skills/huyet_ha_1.png", class: "Huyết Hà" },
        { id: "huyet_ha_2", name: "Huyết Hà Skill 2", icon: "/skills/huyet_ha_2.png", class: "Huyết Hà" },
        { id: "huyet_ha_3", name: "Huyết Hà Skill 3", icon: "/skills/huyet_ha_3.png", class: "Huyết Hà" },

    ],
    "Cửu Linh": [
        { id: "cuu_linh_1", name: "Cửu Linh Skill 1", icon: "/skills/cuu_linh_1.png", class: "Cửu Linh" },
        { id: "cuu_linh_2", name: "Cửu Linh Skill 2", icon: "/skills/cuu_linh_2.png", class: "Cửu Linh" },
        { id: "cuu_linh_3", name: "Cửu Linh Skill 3", icon: "/skills/cuu_linh_3.png", class: "Cửu Linh" },

    ],
    "Tố Vấn": [
        { id: "to_van_1", name: "Tố Vấn Skill 1", icon: "/skills/to_van_1.png", class: "Tố Vấn" },
        { id: "to_van_2", name: "Tố Vấn Skill 2", icon: "/skills/to_van_2.png", class: "Tố Vấn" },
        { id: "to_van_3", name: "Tố Vấn Skill 3", icon: "/skills/to_van_3.png", class: "Tố Vấn" },

    ],
    "Thần Tương": [
        { id: "than_tuong_1", name: "Thần Tương Skill 1", icon: "/skills/than_tuong_1.png", class: "Thần Tương" },
        { id: "than_tuong_2", name: "Thần Tương Skill 2", icon: "/skills/than_tuong_2.png", class: "Thần Tương" },
        { id: "than_tuong_3", name: "Thần Tương Skill 3", icon: "/skills/than_tuong_3.png", class: "Thần Tương" },

    ],
    "Long Ngâm": [
        { id: "long_ngam_1", name: "Long Ngâm Skill 1", icon: "/skills/long_ngam_1.png", class: "Long Ngâm" },
        { id: "long_ngam_2", name: "Long Ngâm Skill 2", icon: "/skills/long_ngam_2.png", class: "Long Ngâm" },
        { id: "long_ngam_3", name: "Long Ngâm Skill 3", icon: "/skills/long_ngam_3.png", class: "Long Ngâm" },

    ],
    "All": UNIVERSAL_SKILLS,
};

// Flatten all skills into a single array (includes class-specific + universal skills)
export const ALL_SKILLS: Skill[] = Object.values(SKILLS).flat();

// Get skills for a specific class
export function getSkillsForClass(classType: Class | null): Skill[] {
    if (!classType) return [];
    return SKILLS[classType] || [];
}

// Get skill by ID
export function getSkillById(skillId: string): Skill | undefined {
    return ALL_SKILLS.find(skill => skill.id === skillId);
}

// Maximum number of skills per member
export const MAX_SKILLS_PER_MEMBER = 3;