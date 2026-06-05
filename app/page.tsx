"use client";

import Link from "next/link";
import { RosterImport } from "@/components/guild-members/RosterImport";
import { PaintModeToolbar } from "@/components/guild-members/PaintModeToolbar";
import { MemberList } from "@/components/guild-members/MemberList";
import { DonateModal } from "@/components/shared/DonateModal";
import { useFormationStore } from "@/store/useFormationStore";
import { ArrowRight, Shield, Sun, Moon, Heart } from "lucide-react";
import { useState, useEffect } from "react";

export default function HomePage() {
  const { guildMembers, loadFromLocalStorage } = useFormationStore();
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);

  // Load from local storage on mount to avoid Next.js hydration issues
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-600/30 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-900/80 backdrop-blur-md sticky top-0 z-20 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/10 border border-blue-500/30 rounded-xl text-blue-500 dark:text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                <Shield size={24} />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-wider text-slate-900 dark:text-slate-100 uppercase">
                  Nghịch Thủy Hàn
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-widest mt-0.5">
                  Công cụ xây dựng đội hình bang chiến
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Donate Button */}
              <button
                onClick={() => setIsDonateModalOpen(true)}
                className="flex items-center gap-2 px-2 py-1 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 border border-red-200 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-400 transition-all active:scale-95 cursor-pointer"
                title="Support Development"
              >
                Donate <Heart size={16} fill="currentColor" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 transition-all active:scale-95 cursor-pointer"
                title="Toggle light/dark mode"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              <Link
                href="/formations/new"
                className="flex-1 sm:flex-initial px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:shadow-[0_0_25px_rgba(59,130,246,0.45)] border border-blue-400/20 active:scale-95 cursor-pointer"
              >
                Xây dựng đội hình
                <ArrowRight size={14} className="animate-pulse" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Roster Import */}
          <RosterImport />

          {/* Paint Mode Toolbar */}
          {guildMembers.length > 0 && <PaintModeToolbar />}

          {/* Member List */}
          <MemberList />
        </div>
      </main>

      {/* Donate Modal */}
      <DonateModal
        isOpen={isDonateModalOpen}
        onClose={() => setIsDonateModalOpen(false)}
      />
    </div>
  );
}
