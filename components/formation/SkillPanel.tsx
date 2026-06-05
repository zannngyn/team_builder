"use client";

import { Class } from "@/types";
import { SKILLS } from "@/lib/constants/skills";
import { CLASS_COLORS } from "@/lib/constants/classes";
import { BookOpen } from "lucide-react";

interface SkillPanelProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function SkillPanel({ isCollapsed, onToggleCollapse }: SkillPanelProps) {
  const classes: Class[] = [
    "Thiết Y",
    "Toái Mộng",
    "Huyết Hà",
    "Cửu Linh",
    "Tố Vấn",
    "Thần Tương",
    "Long Ngâm",
  ];

  return (
    <div
      className={`bg-white/80 dark:bg-slate-950/70 border-2 border-slate-200 dark:border-slate-800 rounded-xl backdrop-blur-md transition-all duration-300 overflow-hidden ${
        isCollapsed ? "w-12" : "w-72"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
        {!isCollapsed && (
          <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Chiêu Thức
          </h3>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors text-slate-500 dark:text-slate-400"
          title={isCollapsed ? "Mở rộng" : "Thu gọn"}
        >
          <BookOpen size={16} />
        </button>
      </div>

      {/* Skills List - Reference Only */}
      {!isCollapsed && (
        <div className="p-3 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Info banner */}
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 rounded-lg p-2.5 mb-3">
            <p className="text-[10px] text-blue-600 dark:text-blue-400 leading-relaxed">
              💡 <strong>Cách dùng:</strong> Click vào ô skill trên member card
              để chọn chiêu thức
            </p>
          </div>

          {classes.map((classType) => {
            const classSkills = SKILLS[classType];
            if (classSkills.length === 0) return null;

            return (
              <div key={classType}>
                {/* Class Header */}
                <div className="mb-2">
                  <h4
                    className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded"
                    style={{
                      color: CLASS_COLORS[classType],
                      backgroundColor: `${CLASS_COLORS[classType]}15`,
                      borderLeft: `3px solid ${CLASS_COLORS[classType]}`,
                    }}
                  >
                    {classType}
                  </h4>
                </div>

                {/* Skills - Simple display */}
                <div className="space-y-1.5">
                  {classSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg"
                    >
                      {/* Skill Icon */}
                      <img
                        src={skill.icon}
                        alt={skill.name}
                        className="w-6 h-6 rounded flex-shrink-0"
                      />
                      {/* Skill Name */}
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex-1 truncate">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Collapsed State Help Text */}
      {isCollapsed && (
        <div className="p-2 flex flex-col items-center justify-center text-center">
          <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider writing-mode-vertical transform rotate-180">
            Chiêu
          </span>
        </div>
      )}
    </div>
  );
}
