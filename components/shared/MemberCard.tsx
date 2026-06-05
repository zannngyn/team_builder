"use client";

import { Member, MemberTag, Lane, Class } from "@/types";
import { CLASS_COLORS } from "@/lib/constants/classes";
import { LANE_COLORS, LANES, MEMBER_TAGS } from "@/lib/constants/lanes";
import { X, GripVertical, Plus, ChevronDown } from "lucide-react";
import { ClassSelector } from "./ClassSelector";
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
};

interface MemberCardProps {
  member: Member;
  onUpdateClass?: (cls: Class | null) => void;
  onUpdateLane?: (lane: Lane | null) => void;
  onToggleTag?: (tag: MemberTag) => void;
  onRemove?: () => void;
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
  });

  const borderGlowColor = member.class ? CLASS_COLORS[member.class] : "";
  const hasOpenDropdown =
    !isCompact && (showClassSelector || showLaneSelector || showTagSelector);

  const style: React.CSSProperties = {
    borderColor: borderGlowColor || "var(--card-border)",
    boxShadow:
      borderGlowColor && !isDragging
        ? `0 0 10px ${borderGlowColor}20, inset 0 0 10px ${borderGlowColor}05`
        : undefined,
    opacity: isDragging ? 0.3 : undefined,
    // Bring card to top layer if a dropdown is open to prevent overlap clipping
    zIndex: isDragging ? 50 : hasOpenDropdown ? 40 : undefined,
  };

  // Handle paint mode click
  const handleCardClick = (e: React.MouseEvent) => {
    if (paintMode.active && paintMode.selectedClass) {
      e.stopPropagation();
      updateMemberClass(member.id, paintMode.selectedClass);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={handleCardClick}
      {...(draggable && !paintMode.active ? listeners : {})}
      {...(draggable && !paintMode.active ? attributes : {})}
      className={`bg-white/80 dark:bg-slate-950/70 border-2 rounded-xl backdrop-blur-md transition-all relative group flex items-center w-full px-3 py-1.5 min-h-[42px] select-none ${
        paintMode.active
          ? "cursor-pointer hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          : draggable
          ? "hover:border-slate-500 cursor-grab active:cursor-grabbing"
          : ""
      }`}
    >
      {/* Remove Button */}
      {onRemove && showControls && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 bg-red-50 dark:bg-red-950/80 hover:bg-red-100 dark:hover:bg-red-900/90 border border-red-200 dark:border-red-800/80 hover:border-red-500 rounded z-20 cursor-pointer"
          title="Xóa người chơi"
        >
          <X
            size={10}
            className="text-red-500 dark:text-red-400 hover:text-red-650 dark:hover:text-red-200"
          />
        </button>
      )}

      <div
        className={`flex flex-row items-center justify-between w-full gap-2 ${
          onRemove ? "pr-2" : ""
        }`}
      >
        {/* Left Section: Name & Tags */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
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
              className="font-bold text-slate-800 dark:text-slate-100 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-1 focus:outline-none focus:border-blue-500 w-full"
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

          {/* Lane Icon (Hidden for now as requested) */}
          {false && member.lane && (
            <img
              src={`/images/lanes/${(member.lane as string).toLowerCase()}.png`}
              alt={member.lane as string}
              className="w-3.5 h-3.5 object-contain flex-shrink-0"
              title={member.lane as string}
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          )}

          {/* Inline Tags */}
          {member.tags.length > 0 && (
            <div className="flex gap-1 items-center flex-shrink-0">
              {isCompact ? (
                member.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.2 rounded-full text-[8px] font-semibold border bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 whitespace-nowrap"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <>
                  <div className="hidden sm:flex gap-1 items-center flex-shrink-0">
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
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Section for Compact Mode Class Abbreviation */}
        {isCompact && member.class && (
          <span
            className="text-[9px] font-black px-1 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex-shrink-0 select-none z-10 transition-opacity duration-150 group-hover:opacity-0"
            style={{
              color: CLASS_COLORS[member.class],
              borderColor: `${CLASS_COLORS[member.class]}30`,
            }}
            title={member.class}
          >
            {CLASS_ABBREVIATIONS[member.class]}
          </span>
        )}

        {/* Right Section: Badges & Selectors */}
        {!isCompact && (
          <div className="flex items-center gap-1.5 flex-shrink-0">
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
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider transition-all border whitespace-nowrap ${
                  member.class
                    ? "border-transparent"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-transparent"
                } ${
                  onUpdateClass && showControls
                    ? "hover:border-slate-500 cursor-pointer"
                    : ""
                }`}
              >
                {member.class || "Phái"}
              </button>
            )}

            {/* Lane Badge (Hidden for now as requested) */}
            {false &&
              (showControls && onUpdateLane ? (
                <div ref={laneRef} className="relative z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowLaneSelector(!showLaneSelector);
                    }}
                    className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-slate-100 transition-all flex items-center gap-0.5 cursor-pointer whitespace-nowrap"
                  >
                    {member.lane || "Lane"}
                    <ChevronDown size={8} className="opacity-60" />
                  </button>

                  {showLaneSelector && (
                    <div className="absolute right-0 mt-1 w-24 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.6)] p-1 z-30">
                      <button
                        onClick={() => {
                          onUpdateLane?.(null);
                          setShowLaneSelector(false);
                        }}
                        className="w-full text-left px-2 py-1 text-[10px] text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors font-bold uppercase tracking-wider"
                      >
                        Không
                      </button>
                      {LANES.map((l) => (
                        <button
                          key={l}
                          onClick={() => {
                            onUpdateLane?.(l);
                            setShowLaneSelector(false);
                          }}
                          className="w-full text-left px-2 py-1 text-[10px] font-bold rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors uppercase tracking-wider"
                          style={{ color: LANE_COLORS[l] }}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                member.lane && (
                  <span
                    className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border whitespace-nowrap"
                    style={{
                      backgroundColor: `${LANE_COLORS[member.lane as Lane]}15`,
                      color: LANE_COLORS[member.lane as Lane],
                      borderColor: `${LANE_COLORS[member.lane as Lane]}30`,
                    }}
                  >
                    {member.lane}
                  </span>
                )
              ))}

            {/* Add Tag Trigger */}
            {showControls && onToggleTag && (
              <div ref={tagRef} className="relative z-10">
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
                  <div className="absolute right-0 mt-1 w-32 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.6)] p-1 z-30">
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
        )}
      </div>
    </div>
  );
}
