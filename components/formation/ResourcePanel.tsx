"use client";

import { useState, useEffect } from "react";
import { useFormationStore } from "@/store/useFormationStore";
import { UnassignedPool } from "./UnassignedPool";
import { Class } from "@/types";
import { SKILLS, Skill } from "@/lib/constants/skills";
import { CLASS_COLORS } from "@/lib/constants/classes";
import { Users, Swords, ChevronLeft, ChevronRight } from "lucide-react";

interface ResourcePanelProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  selectedMemberId: string | null;
  activeTab: "members" | "skills";
  onTabChange: (tab: "members" | "skills") => void;
}

export function ResourcePanel({
  isCollapsed,
  onToggleCollapse,
  selectedMemberId,
  activeTab,
  onTabChange,
}: ResourcePanelProps) {
  const { guildMembers } = useFormationStore();

  // Get selected member's class for filtering skills
  const selectedMember = selectedMemberId
    ? guildMembers.find((m) => m.id === selectedMemberId)
    : null;
  const selectedClass = selectedMember?.class;

  // Get skills for selected member's class, or all skills if no member selected
  const availableSkills = selectedClass
    ? SKILLS[selectedClass] || []
    : Object.values(SKILLS).flat();

  return (
    <div
      className={`bg-white/80 dark:bg-slate-950/70 border-2 border-slate-200 dark:border-slate-800 rounded-xl backdrop-blur-md transition-all duration-300 overflow-hidden h-full flex flex-col relative ${
        isCollapsed ? "w-12" : "w-full"
      }`}
    >
      {/* Toggle Button - positioned absolutely relative to panel */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-6 z-20 p-2 bg-white dark:bg-slate-900 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full transition-all border-2 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 shadow-md hover:shadow-lg"
        title={isCollapsed ? "Mở rộng" : "Thu gọn"}
      >
        {isCollapsed ? (
          <ChevronRight size={16} className="stroke-[2.5]" />
        ) : (
          <ChevronLeft size={16} className="stroke-[2.5]" />
        )}
      </button>
      {/* Header with Tabs */}
      <div className="flex flex-col border-b border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
        {!isCollapsed && (
          <div className="flex items-center border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={() => onTabChange("members")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === "members"
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-b-2 border-blue-500"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
              }`}
            >
              <Users size={14} />
              Thành viên
            </button>
            <button
              onClick={() => onTabChange("skills")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === "skills"
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-b-2 border-blue-500"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
              }`}
            >
              <Swords size={14} />
              Chiêu Thức
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="flex-1 overflow-hidden">
          {activeTab === "members" ? (
            <div className="h-full">
              <UnassignedPool isCollapsed={false} onToggleCollapse={() => {}} />
            </div>
          ) : (
            <div className="p-3 space-y-3 h-full overflow-y-auto">
              {selectedMember && (
                <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
                  <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                    Đang chọn
                  </p>
                  <p className="text-xs font-black text-slate-800 dark:text-slate-200">
                    {selectedMember.name}
                  </p>
                  {selectedClass && (
                    <p
                      className="text-[10px] font-bold uppercase tracking-wider mt-1"
                      style={{ color: CLASS_COLORS[selectedClass] }}
                    >
                      {selectedClass}
                    </p>
                  )}
                </div>
              )}

              {selectedClass ? (
                // Show skills for selected member's class
                <div className="space-y-2">
                  {/* Info banner */}
                  <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 rounded-lg p-2.5 mb-3">
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 leading-relaxed">
                      💡 <strong>Cách dùng:</strong> Click vào ô skill trên
                      member card để chọn chiêu thức
                    </p>
                  </div>
                </div>
              ) : (
                // Show message to select a member
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <Swords
                    size={32}
                    className="text-slate-300 dark:text-slate-700 mb-3"
                  />
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Chưa chọn thành viên
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-500">
                    Click vào member card để xem chiêu thức của phái đó
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Collapsed State */}
      {isCollapsed && (
        <div className="flex-1 flex flex-col items-center justify-start p-2 gap-4">
          <button
            onClick={() => {
              onToggleCollapse();
              onTabChange("members");
            }}
            className={`p-2 rounded transition-colors ${
              activeTab === "members"
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
            title="Thành viên"
          >
            <Users size={18} />
          </button>
          <button
            onClick={() => {
              onToggleCollapse();
              onTabChange("skills");
            }}
            className={`p-2 rounded transition-colors ${
              activeTab === "skills"
                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
            title="Chiêu Thức"
          >
            <Swords size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
