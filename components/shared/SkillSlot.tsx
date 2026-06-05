"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { getSkillById, ALL_SKILLS } from "@/lib/constants/skills";
import { Class } from "@/types";
import { CLASS_COLORS } from "@/lib/constants/classes";
import { useFormationStore } from "@/store/useFormationStore";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useInteractions,
} from "@floating-ui/react";

interface SkillSlotProps {
  memberId: string;
  memberClass: Class | null;
  slotIndex: number;
  skillId: string | null;
  onRemoveSkill?: () => void;
}

export function SkillSlot({
  memberId,
  memberClass,
  slotIndex,
  skillId,
  onRemoveSkill,
}: SkillSlotProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [mounted, setMounted] = useState(false);
  const updateMemberSkills = useFormationStore(
    (state) => state.updateMemberSkills,
  );
  const guildMembers = useFormationStore((state) => state.guildMembers);

  const skill = skillId ? getSkillById(skillId) : null;

  // Set mounted state for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Floating UI setup
  const { refs, floatingStyles, context } = useFloating({
    open: showPicker,
    onOpenChange: setShowPicker,
    middleware: [
      offset(8),
      flip({
        fallbackAxisSideDirection: "start",
      }),
      shift({ padding: 8 }),
    ],
    whileElementsMounted: autoUpdate,
    placement: "bottom-start",
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  const handleSkillSelect = (selectedSkillId: string) => {
    const member = guildMembers.find((m) => m.id === memberId);
    if (!member) return;

    const existingSkills = member.skills || [];

    // Check for duplicate
    if (existingSkills.includes(selectedSkillId)) {
      // Don't allow duplicate
      setShowPicker(false);
      return;
    }

    // Update skill at this slot
    const newSkills = [...existingSkills];
    newSkills[slotIndex] = selectedSkillId;

    updateMemberSkills(memberId, newSkills);
    setShowPicker(false);
  };

  const handleSlotClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!skill) {
      // Empty slot - open picker
      setShowPicker(true);
    }
  };

  return (
    <>
      <div className="relative">
        <div
          ref={refs.setReference}
          {...getReferenceProps()}
          onClick={handleSlotClick}
          className={`relative w-6 h-6 rounded border-1 flex items-center justify-center transition-all group cursor-pointer ${
            skill
              ? "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600"
              : "border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 hover:border-blue-400 dark:hover:border-blue-600"
          }`}
          title={skill ? skill.name : "Click to add skill"}
        >
          {skill ? (
            <>
              {/* Skill Icon */}
              <img
                src={skill.icon}
                alt={skill.name}
                className="w-full h-full rounded object-cover"
                onError={(e) => {
                  // Fallback for broken images
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              {/* Fallback text icon (hidden unless image fails) */}
              <div
                className="w-full h-full rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[8px] font-bold text-slate-600 dark:text-slate-400"
                style={{ display: "none" }}
              >
                {skill.name.substring(0, 2)}
              </div>

              {/* Remove Button (shown on hover) */}
              {onRemoveSkill && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveSkill();
                  }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  title="Remove skill"
                >
                  <X size={8} className="text-white" />
                </button>
              )}
            </>
          ) : (
            /* Empty Slot Indicator */
            <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
          )}
        </div>
      </div>

      {/* Skill Picker Popup - Rendered via Portal */}
      {showPicker &&
        mounted &&
        createPortal(
          <div
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              zIndex: 1000,
            }}
            {...getFloatingProps()}
            className="w-72 max-h-80 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-y-auto overflow-x-hidden"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 py-2 z-1">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Chọn Chiêu Thức
              </p>
            </div>

            {/* Skills Grid - Icon grid like Discord emoji picker */}
            <div className="grid grid-cols-6 gap-1 p-2">
              {ALL_SKILLS.map((skillOption) => {
                const member = guildMembers.find((m) => m.id === memberId);
                const isDuplicate =
                  member?.skills?.includes(skillOption.id) || false;

                return (
                  <button
                    key={skillOption.id}
                    onClick={() => handleSkillSelect(skillOption.id)}
                    disabled={isDuplicate}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all group/skill relative ${
                      isDuplicate
                        ? "opacity-30 cursor-not-allowed"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-110"
                    }`}
                    title={skillOption.name}
                  >
                    <img
                      src={skillOption.icon}
                      alt={skillOption.name}
                      className="w-8 h-8 rounded object-cover"
                      onError={(e) => {
                        // Fallback for broken images
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const fallback =
                          target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                    {/* Fallback text icon (hidden unless image fails) */}
                    <div
                      className="w-10 h-10 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-400"
                      style={{ display: "none" }}
                    >
                      {skillOption.name.substring(0, 2)}
                    </div>

                    {/* Skill name tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[9px] font-bold rounded whitespace-nowrap opacity-0 group-hover/skill:opacity-100 pointer-events-none transition-opacity z-[1001]">
                      {skillOption.name}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-slate-900 dark:border-t-slate-100" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
