"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useFormationStore } from "@/store/useFormationStore";
import { FormationBoard } from "@/components/formation/FormationBoard";
import { DonateModal } from "@/components/shared/DonateModal";
import {
  ArrowLeft,
  Save,
  Trash2,
  Download,
  Upload,
  Copy,
  Image as ImageIcon,
  Sparkles,
  Sun,
  Moon,
  Heart,
} from "lucide-react";
import {
  exportFormationToCSV,
  importFormationFromCSV,
} from "@/lib/utils/export";
import html2canvas from "html2canvas";

export default function NewFormationPage() {
  const {
    guildMembers,
    removeAllFromTeams,
    importFormation,
    loadFromLocalStorage,
    formation,
  } = useFormationStore();
  const [formationName, setFormationName] = useState("Đội hình Bang Chiến Mới");
  const [isSaving, setIsSaving] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    loadFromLocalStorage();
    const isLight = !document.documentElement.classList.contains("dark");
    setTheme(isLight ? "light" : "dark");
  }, [loadFromLocalStorage]);

  const toggleTheme = () => {
    if (theme === "dark") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    }
  };

  // Sync state formation name if loaded
  useEffect(() => {
    if (formation?.name) {
      setFormationName(formation.name);
    }
  }, [formation]);

  const handleClearTeams = () => {
    if (confirm("Bạn có chắc muốn xóa tất cả phân công đội hình?")) {
      removeAllFromTeams();
    }
  };

  const handleExportCSV = () => {
    if (!formation) return;
    exportFormationToCSV(formation.divisions, guildMembers, formationName);
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target?.result as string;
      try {
        const divisions = importFormationFromCSV(csvText);
        importFormation(divisions);
      } catch (err) {
        alert(
          "Không thể nhập CSV: Định dạng không hợp lệ hoặc thiếu thành viên.",
        );
      }
    };
    reader.readAsText(file);
  };

  const handleExportImage = async () => {
    const boardElement = document.getElementById("formation-board-capture");
    if (!boardElement) {
      alert("Không tìm thấy bảng đội hình để chụp ảnh.");
      return;
    }

    try {
      // Wait for fonts to load to prevent text misalignment
      await document.fonts.ready;

      // Small delay to ensure all rendering is complete
      await new Promise((resolve) => setTimeout(resolve, 300));

      const canvas = await html2canvas(boardElement, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: theme === "dark" ? "#020617" : "#f8fafc",
        scale: 2,
        logging: false,
        windowWidth: boardElement.scrollWidth,
        windowHeight: boardElement.scrollHeight,
        onclone: (clonedDoc) => {
          // Ensure the cloned document has the same theme
          const clonedElement = clonedDoc.getElementById(
            "formation-board-capture",
          );
          if (clonedElement) {
            clonedElement.style.transform = "none";
          }
        },
      });

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${formationName
        .toLowerCase()
        .replace(/\s+/g, "_")}_formation.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      alert("Không thể tạo ảnh: " + err);
    }
  };

  const handleExportText = () => {
    const currentFormation = useFormationStore.getState().formation;
    if (!currentFormation) return;

    let output = `🛡️ === ${formationName.toUpperCase()} === 🛡️\n\n`;

    currentFormation.divisions.forEach((div) => {
      output += `⚔️ DIVISION ${div.divisionId} ⚔️\n`;
      div.teams.forEach((team) => {
        const members = useFormationStore
          .getState()
          .getTeamMembers(team.teamId);
        const laneStr = team.lane ? ` [${team.lane}]` : "";
        output += `\n[Team ${team.teamId}]${laneStr} (${members.length}/6 members)\n`;
        if (members.length === 0) {
          output += `  - (Empty)\n`;
        } else {
          members.forEach((m, idx) => {
            const cls = m.class ? ` - ${m.class}` : "";
            const tags = m.tags.length > 0 ? ` (${m.tags.join(", ")})` : "";
            output += `  ${idx + 1}. ${m.name}${cls}${tags}\n`;
          });
        }
      });
      output += `\n`;
    });

    navigator.clipboard.writeText(output);
    alert(
      "Đã sao chép cấu trúc đội hình vào clipboard! Sẵn sàng dán vào Discord/Zalo.",
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Persist active formation name
    const currentStore = useFormationStore.getState();
    if (currentStore.formation) {
      const updated = { ...currentStore.formation, name: formationName };
      localStorage.setItem("sow_formation", JSON.stringify(updated));
    }

    setTimeout(() => {
      setIsSaving(false);
      alert("Đã lưu đội hình cục bộ!");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-600/30 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-900/80 backdrop-blur-md sticky top-0 z-20 shadow-[0_4px_25px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.5)] transition-colors duration-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Title / Back */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 rounded-xl transition-all"
                title="Quay lại"
              >
                <ArrowLeft size={18} />
              </Link>
              <input
                type="text"
                value={formationName}
                onChange={(e) => setFormationName(e.target.value)}
                className="text-lg font-black text-slate-900 dark:text-slate-100 bg-transparent border-b-2 border-transparent hover:border-slate-200 dark:hover:border-slate-800 focus:border-blue-500 focus:outline-none px-1 py-0.5 max-w-xs transition-all uppercase tracking-wider"
              />
            </div>

            {/* Actions Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Donate Button */}
              <button
                onClick={() => setIsDonateModalOpen(true)}
                className=" flex items-center gap-2 px-2 py-1 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 border border-red-200 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-400 transition-all active:scale-95 cursor-pointer"
                title="Ủng hộ"
              >
                Donate <Heart size={14} fill="currentColor" />
              </button>
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 transition-all active:scale-95 cursor-pointer"
                title="Chuyển chế độ sáng/tối"
              >
                {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              </button>
              {/* Import CSV */}
              <label className="px-3 py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer transition-all flex items-center gap-1.5 active:scale-95">
                <Upload
                  size={14}
                  className="text-blue-500 dark:text-blue-400"
                />
                Nhập CSV
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImportCSV}
                  className="hidden"
                />
              </label>
              {/* Export CSV */}
              <button
                onClick={handleExportCSV}
                className="px-3 py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <Download
                  size={14}
                  className="text-blue-500 dark:text-blue-400"
                />
                Xuất CSV
              </button>
              {/* Export Image */}
              <button
                onClick={handleExportImage}
                className="px-3 py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                title="Xuất toàn bộ bảng đội hình dưới dạng ảnh PNG độ phân giải cao"
              >
                <ImageIcon
                  size={14}
                  className="text-blue-500 dark:text-blue-400"
                />
                Xuất Ảnh
              </button>
              {/* Export Text */}
              <button
                onClick={handleExportText}
                className="px-3 py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                title="Sao chép danh sách đội hình vào clipboard để chia sẻ Zalo/Discord"
              >
                <Copy size={14} className="text-blue-500 dark:text-blue-400" />
                Xuất Text
              </button>
              {/* Clear Teams */}
              <button
                onClick={handleClearTeams}
                className="px-3 py-2 border border-red-200 dark:border-red-950/60 rounded-xl text-xs font-bold text-red-650 dark:text-red-400 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/40 hover:border-red-300 dark:hover:border-red-800 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <Trash2 size={14} />
                Xóa Bảng
              </button>
              {/* Save */}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(59,130,246,0.25)] hover:shadow-[0_0_20px_rgba(59,130,246,0.45)] cursor-pointer border border-blue-400/20"
              >
                <Save size={14} />
                {isSaving ? "Đang lưu..." : "Lưu Đội Hình"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main
        className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8"
        id="formation-board-capture"
      >
        <FormationBoard />
      </main>

      {/* Donate Modal */}
      <DonateModal
        isOpen={isDonateModalOpen}
        onClose={() => setIsDonateModalOpen(false)}
      />
    </div>
  );
}
