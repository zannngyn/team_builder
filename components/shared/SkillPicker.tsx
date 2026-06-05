"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Member } from "@/types";
import {
  getSkillsForClass,
  getSkillById,
  MAX_SKILLS_PER_MEMBER,
  Skill,
} from "@/lib/constants/skills";
import { X, Plus, Check } from "lucide-react";

interface SkillPickerProps {
  member: Member;
  onUpdateSkills: (skills: string[]) => void;
  onClose: () => void;
}

export function SkillPicker({
  member,
  onUpdateSkills,
  onClose,
}: SkillPickerProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    member.skills || [],
  );
  const modalRef = useRef<HTMLDivElement>(null);

  // Get available skills for the member's class
  const availableSkills = getSkillsForClass(member.class);

  const handleSave = useCallback(() => {
    onUpdateSkills(selectedSkills);
    onClose();
  }, [selectedSkills, onUpdateSkills, onClose]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        handleSave();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleSave]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSave();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [handleSave]);

  const handleToggleSkill = (skillId: string) => {
    if (selectedSkills.includes(skillId)) {
      // Remove skill
      setSelectedSkills(selectedSkills.filter((id) => id !== skillId));
    } else {
      // Add skill if under max limit
      if (selectedSkills.length < MAX_SKILLS_PER_MEMBER) {
        setSelectedSkills([...selectedSkills, skillId]);
      }
    }
  };

  if (!member.class) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div
          ref={modalRef}
          className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Chọn Chiêu Thức
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
            >
              <X size={16} className="text-slate-500 dark:text-slate-400" />
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-8">
            Vui lòng chọn phái cho {member.name} trước khi chọn chiêu thức.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        ref={modalRef}
        className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl p-6 max-w-lg w-full shadow-2xl max-h-[80vh] overflow-y-auto overflow-x-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Chọn Chiêu Thức
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              {member.name} - {member.class} ({selectedSkills.length}/
              {MAX_SKILLS_PER_MEMBER})
            </p>
          </div>
          <button
            onClick={handleSave}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
          >
            <X size={18} className="text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        {/* Skills Grid */}
        {availableSkills.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-8">
            Chưa có chiêu thức nào cho phái {member.class}.
          </p>
        ) : (
          <div className="space-y-2 overflow-x-hidden">
            {availableSkills.map((skill) => {
              const isSelected = selectedSkills.includes(skill.id);
              const canSelect =
                selectedSkills.length < MAX_SKILLS_PER_MEMBER || isSelected;

              return (
                <button
                  key={skill.id}
                  onClick={() => handleToggleSkill(skill.id)}
                  disabled={!canSelect}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                      : canSelect
                      ? "border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      : "border-slate-200 dark:border-slate-800 opacity-40 cursor-not-allowed"
                  }`}
                >
                  {/* Skill Icon Placeholder */}
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "bg-blue-100 dark:bg-blue-900/40"
                        : "bg-slate-100 dark:bg-slate-800"
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {skill.name.substring(0, 2)}
                    </span>
                  </div>

                  {/* Skill Name */}
                  <div className="flex-1 text-left min-w-0">
                    <p
                      className={`text-xs font-bold truncate ${
                        isSelected
                          ? "text-blue-700 dark:text-blue-300"
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {skill.name}
                    </p>
                  </div>

                  {/* Selection Indicator */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                      isSelected
                        ? "border-blue-500 bg-blue-500"
                        : "border-slate-300 dark:border-slate-600"
                    }`}
                  >
                    {isSelected && <Check size={14} className="text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
          <button
            onClick={() => {
              setSelectedSkills([]);
            }}
            className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Xóa Tất Cả
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
