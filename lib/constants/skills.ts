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
    },
    {
        id: "bat-cong",
        name: "Bất Công",
        icon: "/skills/BatCong.png",
        class: "All"
    },
    {
        id: "boi-toan-thien-co",
        name: "Bồi Toản Thiên Cổ",
        icon: "/skills/BoiToanThienCo.png",
        class: "All"
    },
    {
        id: "can-khon-vu",
        name: "Càn Khôn Vũ",
        icon: "/skills/CanKhonVu.png",
        class: "All"
    },
    {
        id: "chau-lac-ngoc-ban",
        name: "Châu Lạc Ngọc Bàn",
        icon: "/skills/ChauLacNgocBan.png",
        class: "All"
    },
    {
        id: "chu-thien-ho-tri",
        name: "Chu Thiên Hộ Trì",
        icon: "/skills/ChuThienHoTri.png",
        class: "All"
    },
    {
        id: "cuong-phong-hoang",
        name: "Cuồng Phong Hoang",
        icon: "/skills/CuongPhongHoang.png",
        class: "All"
    },
    {
        id: "cuu-thien-phu-dao",
        name: "Cửu Thiên Phù Đạo",
        icon: "/skills/CuuThienPhuDao.png",
        class: "All"
    },
    {
        id: "da-cau-con",
        name: "Dạ Cầu Côn",
        icon: "/skills/DaCauCon.png",
        class: "All"
    },
    {
        id: "da-cau-con-2",
        name: "Dạ Cầu Côn 2",
        icon: "/skills/DaCauCon2.png",
        class: "All"
    },
    {
        id: "da-ho-nhat-thuc",
        name: "Dạ Hổ Nhất Thức",
        icon: "/skills/DaHoNhatThuc.png",
        class: "All"
    },
    {
        id: "dai-phong-khoi",
        name: "Đại Phong Khởi",
        icon: "/skills/DaiPhongKhoi.png",
        class: "All"
    },
    {
        id: "di-bo-sinh-tran",
        name: "Di Bộ Sinh Trần",
        icon: "/skills/DiBoSInhTran.png",
        class: "All"
    },
    {
        id: "ham-am",
        name: "Hàm Ẩm",
        icon: "/skills/HamAm.png",
        class: "All"
    },
    {
        id: "hoang-thanh-kiem-khi",
        name: "Hoàng Thành Kiếm Khí",
        icon: "/skills/HoangThanhKiemKhi.png",
        class: "All"
    },
    {
        id: "hoan-sinh-quyet",
        name: "Hoàn Sinh Quyết",
        icon: "/skills/HoanSinhQuyet.png",
        class: "All"
    },
    {
        id: "hon-don-nhat-pha",
        name: "Hổn Độn Nhất Phá",
        icon: "/skills/HonDonNhatPha.png",
        class: "All"
    },
    {
        id: "huu-hoi-dao-phap",
        name: "Hữu Hối Đạo Pháp",
        icon: "/skills/HuuHoiDaoPhap.png",
        class: "All"
    },
    {
        id: "khuynh-tan-phi-hong",
        name: "Khuynh Tàn Phi Hồng",
        icon: "/skills/KhuynhTanPhiHong.png",
        class: "All"
    },
    {
        id: "kim-cang-thong-ti",
        name: "Kim Cang Thống Tỉ",
        icon: "/skills/KimCangThongTi.png",
        class: "All"
    },
    {
        id: "kim-chung-bat-hoai",
        name: "Kim Chung Bất Hoại",
        icon: "/skills/KimChungBatHoai.png",
        class: "All"
    },
    {
        id: "lac-loi-kinh-sa-thuong",
        name: "Lạc Lôi Kinh Sa Thương",
        icon: "/skills/LacLoiKinhSaThuong.png",
        class: "All"
    },
    {
        id: "lam-nguyet-nhu-cau",
        name: "Lãm Nguyệt Như Câu",
        icon: "/skills/LamNguyetNhuCau.png",
        class: "All"
    },
    {
        id: "lam-phuong-tuong-hue",
        name: "Lãm Phương Tương Huệ",
        icon: "/skills/LamPhuongTuongHue.png",
        class: "All"
    },
    {
        id: "lam-tuoc-vi",
        name: "Lãm Tước Vi",
        icon: "/skills/LamTuocVi.png",
        class: "All"
    },
    {
        id: "mac-pha-son-ha",
        name: "Mạc Phá Sơn Hà",
        icon: "/skills/MacPhaSonHa.png",
        class: "All"
    },
    {
        id: "minh-kieu-chi-2",
        name: "Minh Kiều Chi 2",
        icon: "/skills/MinhKieuChi2.png",
        class: "All"
    },
    {
        id: "ngu-khi-trieu-nguyen",
        name: "Ngũ Khí Triều Nguyên",
        icon: "/skills/NguKhiTrieuNguyen.png",
        class: "All"
    },
    {
        id: "nhu-phong-tu-be",
        name: "Như Phong Tự Bế",
        icon: "/skills/NhuPhongTuBe.png",
        class: "All"
    },
    {
        id: "phong-tuyet-kinh-dao",
        name: "Phong Tuyết Kinh Đao",
        icon: "/skills/PhongTuyetKinhDao.png",
        class: "All"
    },
    {
        id: "phong-tuyet-tai-do",
        name: "Phong Tuyết Tái Độ",
        icon: "/skills/PhongTuyetTaiDo.png",
        class: "All"
    },
    {
        id: "tam-nhan-vo-luong",
        name: "Tam Nhãn Vô Lượng",
        icon: "/skills/TamNhanVoLuong.png",
        class: "All"
    },
    {
        id: "tam-phong",
        name: "Tam Phong",
        icon: "/skills/TamPhong.png",
        class: "All"
    },
    {
        id: "thien-ac-trang",
        name: "Thiên Ác Trang",
        icon: "/skills/ThienAcTrang.png",
        class: "All"
    },
    {
        id: "thien-hoa-phuc-loi",
        name: "Thiên Hoa Phúc Lợi",
        icon: "/skills/ThienHoaPhucLoi.png",
        class: "All"
    },
    {
        id: "thien-ma-khieu",
        name: "Thiên Ma Khiêu",
        icon: "/skills/ThienMaKhieu.png",
        class: "All"
    },
    {
        id: "thien-phong-doan-van",
        name: "Thiên Phong Đoạn Vân",
        icon: "/skills/ThienPhongDoanVan.png",
        class: "All"
    },
    {
        id: "thiet-son",
        name: "Thiết Sơn",
        icon: "/skills/ThietSon.png",
        class: "All"
    },
    {
        id: "tieu-nhan-gian-chuong",
        name: "Tiêu Nhàn Gian Chương",
        icon: "/skills/TieuNhanGianChuong.png",
        class: "All"
    },
    {
        id: "tu-dai-giai-khong",
        name: "Tứ Đại Giai Không",
        icon: "/skills/TuDaiGiaiKhong.png",
        class: "All"
    },
    {
        id: "tuong-tu-kiem-phap",
        name: "Tương Tư Kiếm Pháp",
        icon: "/skills/TuongTuKiemPhap.png",
        class: "All"
    },
    {
        id: "vien-hy-cong",
        name: "Viễn Hi Công",
        icon: "/skills/VienHyCong.png",
        class: "All"
    },
    {
        id: "bang-loan-khuyet",
        name: "Băng Loan Khuyết",
        icon: "/skills/BangLoanKhuyet.png",
        class: "All"
    },
    {
        id: "bat-dong-thien-tam",
        name: "Bất Động Thiên Tâm",
        icon: "/skills/BatDongThienTam.png",
        class: "All"
    },
    {
        id: "co-linh-tuy-mong",
        name: "Cô Lĩnh Tuy Mộng",
        icon: "/skills/CoLinhTuyMong.png",
        class: "All"
    },
    {
        id: "dao-tuy-can-khon",
        name: "Đao Túy Càn Khôn",
        icon: "/skills/DaoTuyCanKhon.png",
        class: "All"
    },
    {
        id: "han-diem-doat-phong",
        name: "Hàn Điểm Đoạt Phong",
        icon: "/skills/HanDiemDoatPhong.png",
        class: "All"
    },
    {
        id: "huy-tuyet-han-anh",
        name: "Huy Tuyết Hàn Anh",
        icon: "/skills/HuyTuyetHanAnh.png",
        class: "All"
    },
    {
        id: "kim-qua-duc-hoa",
        name: "Kim Qua Dục Hỏa",
        icon: "/skills/KimQuaDucHoa.png",
        class: "All"
    },
    {
        id: "lam-da-tap-tuyet",
        name: "Lãm Đá Táp Tuyết",
        icon: "/skills/LamDaTapTuyet.png",
        class: "All"
    },
    {
        id: "manh-ho-xuat-kich",
        name: "Mãnh Hổ Xuất Kích",
        icon: "/skills/ManhHoXuatKich.png",
        class: "All"
    },
    {
        id: "nhat-kiem-vo-tich",
        name: "Nhất Kiếm Vô Tích",
        icon: "/skills/NhatKiemVoTIch.png",
        class: "All"
    },
    {
        id: "phat-y-loan-anh",
        name: "Phật Y Loan Anh",
        icon: "/skills/PhatYLoanAnh.png",
        class: "All"
    },
    {
        id: "thien-thu-nan-phong",
        name: "Thiên Thu Nan Phong",
        icon: "/skills/ThienThuNanPhong.png",
        class: "All"
    },
    {
        id: "thuong-phong-hon",
        name: "Thương Phong Hồn",
        icon: "/skills/ThuongPhongHon.png",
        class: "All"
    },
    {
        id: "truy-phong-lien-xuc",
        name: "Truy Phong Liên Xúc",
        icon: "/skills/TruyPhongLienXuc.png",
        class: "All"
    },
    {
        id: "viem-long-pha-uyen",
        name: "Viêm Long Phá Uyển",
        icon: "/skills/ViemLongPhaUyen.png",
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