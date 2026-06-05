"use client";

import { Member, MemberTag, Lane, Class } from "@/types";
import { CLASS_COLORS } from "@/lib/constants/classes";
import { LANE_COLORS, LANES, MEMBER_TAGS } from "@/lib/constants/lanes";
import { X, GripVertical, Plus, ChevronDown } from "lucide-react";
import { ClassSelector } from "./ClassSelector";
import { SkillSlot } from "./SkillSlot";
import { useState, useRef, useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import { useFormationStore } from "@/store/useFormationStore";

const CLASS_ABBREVIATIONS: Record<Class, string> = {
  "Thiết Y": "TY",
  "Toái Mộng": "TM",
  "Huyết Hà": "HH",
  "Cửu Linh": "CL",
  "Tố Vấn": "TV",
  "Thần Tương": "TT",
  "Long Ngâm": "LN",
  All: "ALL",
};

interface MemberCardProps {
  member: Member;
  onUpdateClass?: (cls: Class | null) => void;
  onUpdateLane?: (lane: Lane | null) => void;
  onToggleTag?: (tag: MemberTag) => void;
  onRemove?: () => void;
  onMemberClick?: (memberId: string) => void;
  showControls?: boolean;
  draggable?: boolean;
  size?: "sm" | "md" | "lg";
  isCompact?: boolean;
}

export function MemberCard({
  member,
  onUpdateClass,
  onUpdateLane,
  onToggleTag,
  onRemove,
  onMemberClick,
  showControls = true,
  draggable = false,
  size = "md",
  isCompact = false,
}: MemberCardProps) {
  const [showClassSelector, setShowClassSelector] = useState(false);
  const [showLaneSelector, setShowLaneSelector] = useState(false);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(member.name);

  const updateMemberName = useFormationStore((state) => state.updateMemberName);
  const paintMode = useFormationStore((state) => state.paintMode);
  const updateMemberClass = useFormationStore(
    (state) => state.updateMemberClass,
  );
  const updateMemberSkills = useFormationStore(
    (state) => state.updateMemberSkills,
  );

  useEffect(() => {
    setEditName(member.name);
  }, [member.name]);

  const handleSaveName = () => {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== member.name) {
      updateMemberName(member.id, trimmed);
    } else {
      setEditName(member.name);
    }
    setIsEditing(false);
  };

  const laneRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (laneRef.current && !laneRef.current.contains(target)) {
        setShowLaneSelector(false);
      }
      if (tagRef.current && !tagRef.current.contains(target)) {
        setShowTagSelector(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Set up dnd-kit draggable - disabled when paint mode is active
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: member.id,
    disabled: !draggable || paintMode.active,
    data: {
      type: "member",
      member: member,
    },
  });

  const borderGlowColor = member.class ? CLASS_COLORS[member.class] : "";
  const hasOpenDropdown =
    !isCompact && (showClassSelector || showLaneSelector || showTagSelector);

  const style: React.CSSProperties = {
    borderColor: borderGlowColor || "var(--card-border)",
    backgroundColor: borderGlowColor ? `${borderGlowColor}66` : undefined,
    boxShadow:
      borderGlowColor && !isDragging
        ? `0 0 10px ${borderGlowColor}20, inset 0 0 10px ${borderGlowColor}05`
        : undefined,
    opacity: isDragging ? 0.3 : undefined,
    // Bring card to top layer if a dropdown is open to prevent overlap clipping
    zIndex: isDragging ? 50 : hasOpenDropdown ? 40 : undefined,
  };

  // Handle card click (paint mode or member selection)
  const handleCardClick = (e: React.MouseEvent) => {
    if (paintMode.active && paintMode.selectedClass) {
      e.stopPropagation();
      updateMemberClass(member.id, paintMode.selectedClass);
    } else if (onMemberClick && member.class) {
      // Only trigger member selection if member has a class assigned
      e.stopPropagation();
      onMemberClick(member.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={handleCardClick}
      {...(draggable && !paintMode.active ? attributes : {})}
      className={`bg-white/80 dark:bg-slate-950/70 border-2 rounded-xl backdrop-blur-md transition-all relative group flex items-center w-full px-3 py-1.5 min-h-[42px] select-none ${
        paintMode.active
          ? "cursor-pointer hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          : ""
      }`}
    >
      {/* Drag Handle - only this has drag listeners , center horizontal and vertical*/}
      {draggable && !paintMode.active && (
        <div
          {...listeners}
          className="cursor-grab active:cursor-grabbing pr-2 -ml-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex items-center justify-center"
          title="Drag to move member"
        >
          <GripVertical size={20} />
        </div>
      )}

      {/* Content - Two Row Layout for non-compact, Original for compact */}
      {isCompact ? (
        /* Compact Mode - Original horizontal layout */
        <div className="flex flex-row items-center justify-between w-full gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {/* Name */}
            <div className="font-bold text-slate-800 dark:text-slate-100 text-xs truncate">
              {member.name}
            </div>

            {/* Tags */}
            {member.tags.length > 0 && (
              <div className="flex gap-1 items-center flex-shrink-0">
                {member.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.2 rounded-full text-[8px] font-semibold border bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 whitespace-nowrap"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Class Abbreviation */}
          {member.class && (
            <span
              className="text-[9px] font-black px-1 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex-shrink-0"
              style={{
                color: CLASS_COLORS[member.class],
                borderColor: `${CLASS_COLORS[member.class]}30`,
              }}
              title={member.class}
            >
              {CLASS_ABBREVIATIONS[member.class]}
            </span>
          )}
        </div>
      ) : (
        /* Non-Compact Mode - New top/bottom layout */
        <div className="flex flex-col gap-1 w-full">
          {/* Top Row: Name + Tags + Tag Selector */}
          <div className="flex items-center gap-2 min-w-0">
            {/* Name (editable) */}
            {isEditing ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleSaveName}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveName();
                  if (e.key === "Escape") {
                    setEditName(member.name);
                    setIsEditing(false);
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className="font-bold text-slate-800 dark:text-slate-100 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-1 focus:outline-none focus:border-blue-500 flex-1 min-w-0"
                autoFocus
              />
            ) : (
              <div
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="font-bold text-slate-800 dark:text-slate-100 text-xs truncate flex-1 min-w-0 cursor-text select-text"
                title="Nhấp đúp để đổi tên người chơi"
              >
                {member.name}
              </div>
            )}

            {/* Tags */}
            {member.tags.length > 0 && (
              <div className="flex gap-1 items-center flex-shrink-0">
                {member.tags.slice(0, 1).map((tag) => (
                  <span
                    key={tag}
                    onClick={() =>
                      onToggleTag && showControls && onToggleTag(tag)
                    }
                    className={`px-1.5 py-0.2 rounded-full text-[8px] font-semibold border bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 whitespace-nowrap ${
                      onToggleTag && showControls
                        ? "cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-red-600 dark:hover:text-red-450"
                        : ""
                    }`}
                  >
                    {tag}
                  </span>
                ))}
                {member.tags.length > 1 && (
                  <span className="text-[8px] text-slate-500 font-bold">
                    +{member.tags.length - 1}
                  </span>
                )}
              </div>
            )}

            {/* Add Tag Button */}
            {showControls && onToggleTag && (
              <div ref={tagRef} className="relative flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTagSelector(!showTagSelector);
                  }}
                  className="p-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 hover:border-slate-350 dark:hover:border-slate-500 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all cursor-pointer"
                  title="Quản lý thẻ"
                >
                  <Plus size={10} />
                </button>

                {showTagSelector && (
                  <div className="absolute right-0 top-full mt-1 w-32 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.6)] p-1 z-30">
                    <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 px-2 py-1 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800/60 mb-1">
                      Thẻ Chiến Thuật
                    </div>
                    {MEMBER_TAGS.map((tag) => {
                      const hasTag = member.tags.includes(tag);
                      return (
                        <button
                          key={tag}
                          onClick={() => {
                            onToggleTag(tag);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 text-[9px] font-bold rounded-md transition-colors flex items-center justify-between uppercase tracking-wider ${
                            hasTag
                              ? "bg-blue-50/80 dark:bg-slate-800/80 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200"
                          }`}
                        >
                          {tag}
                          {hasTag && (
                            <span className="text-[10px] text-green-400">
                              ✓
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Row: Skills + Class Badge + Delete Button */}
          <div className="flex items-center gap-1">
            {/* 3 Skill Slots */}
            <SkillSlot
              memberId={member.id}
              memberClass={member.class}
              slotIndex={0}
              skillId={member.skills?.[0] || null}
              onRemoveSkill={
                showControls
                  ? () => {
                      const newSkills = [...(member.skills || [])];
                      newSkills.splice(0, 1);
                      updateMemberSkills(member.id, newSkills);
                    }
                  : undefined
              }
            />
            <SkillSlot
              memberId={member.id}
              memberClass={member.class}
              slotIndex={1}
              skillId={member.skills?.[1] || null}
              onRemoveSkill={
                showControls
                  ? () => {
                      const newSkills = [...(member.skills || [])];
                      newSkills.splice(1, 1);
                      updateMemberSkills(member.id, newSkills);
                    }
                  : undefined
              }
            />
            <SkillSlot
              memberId={member.id}
              memberClass={member.class}
              slotIndex={2}
              skillId={member.skills?.[2] || null}
              onRemoveSkill={
                showControls
                  ? () => {
                      const newSkills = [...(member.skills || [])];
                      newSkills.splice(2, 1);
                      updateMemberSkills(member.id, newSkills);
                    }
                  : undefined
              }
            />

            {/* Class Badge */}
            {showClassSelector && onUpdateClass ? (
              <div className="z-20">
                <ClassSelector
                  value={member.class}
                  onChange={(cls) => {
                    onUpdateClass(cls);
                    setShowClassSelector(false);
                  }}
                  size="sm"
                />
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onUpdateClass && showControls) setShowClassSelector(true);
                }}
                disabled={!onUpdateClass || !showControls}
                style={{
                  backgroundColor: member.class
                    ? `${CLASS_COLORS[member.class]}15`
                    : undefined,
                  color: member.class ? CLASS_COLORS[member.class] : undefined,
                  borderColor: member.class
                    ? `${CLASS_COLORS[member.class]}40`
                    : undefined,
                }}
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider transition-all border whitespace-nowrap flex-shrink-0 ${
                  member.class
                    ? "border-transparent"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-transparent"
                } ${
                  onUpdateClass && showControls
                    ? "hover:border-slate-500 cursor-pointer"
                    : ""
                }`}
                title={member.class || undefined}
              >
                {member.class ? CLASS_ABBREVIATIONS[member.class] : "Phái"}
              </button>
            )}

            {/* Delete Button */}
            {onRemove && showControls && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="p-0.5 bg-red-50 dark:bg-red-950/80 hover:bg-red-100 dark:hover:bg-red-900/90 border border-red-200 dark:border-red-800/80 hover:border-red-500 rounded flex-shrink-0 cursor-pointer transition-colors ml-auto"
                title="Xóa người chơi"
              >
                <X
                  size={10}
                  className="text-red-500 dark:text-red-400 hover:text-red-650 dark:hover:text-red-200"
                />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
