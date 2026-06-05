"use client";

import { useFormationStore } from "@/store/useFormationStore";
import { MemberCard } from "@/components/shared/MemberCard";
import { AlertTriangle } from "lucide-react";
import { checkTeamHealth } from "@/lib/utils/teamHealth";
import { useDroppable } from "@dnd-kit/core";
import { Member } from "@/types";

import { useState, useEffect } from "react";

const DEFAULT_LANE_NAMES = {
  Top: "Top",
  Mid: "Mid",
  Bot: "Bot",
  Flex: "Flex",
};

interface TeamBoxProps {
  teamId: number;
  divisionId: 1 | 2;
  onMemberClick?: (memberId: string) => void;
}

// Individual slot component with its own drop zone
function TeamSlot({
  teamId,
  position,
  member,
  onUpdateClass,
  onUpdateLane,
  onToggleTag,
  onRemove,
  onMemberClick,
}: {
  teamId: number;
  position: number;
  member: any;
  onUpdateClass: (cls: any) => void;
  onUpdateLane: (lane: any) => void;
  onToggleTag: (tag: any) => void;
  onRemove: () => void;
  onMemberClick?: (memberId: string) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: `team-${teamId}-slot-${position}`,
    data: {
      type: "team-slot",
      teamId,
      position,
    },
  });

  if (member) {
    // Occupied slot - show member card
    return (
      <div
        ref={setNodeRef}
        className={`transition-all ${
          isOver ? "scale-[1.02] ring-2 ring-blue-500 rounded-xl" : ""
        }`}
      >
        <MemberCard
          member={member}
          onUpdateClass={onUpdateClass}
          onUpdateLane={onUpdateLane}
          onToggleTag={onToggleTag}
          onRemove={onRemove}
          onMemberClick={onMemberClick}
          showControls={true}
          draggable={true}
          size="sm"
          isCompact={false}
        />
      </div>
    );
  }

  // Empty slot - show placeholder
  return (
    <div
      ref={setNodeRef}
      className={`border-2 border-dashed rounded-xl p-3 text-center text-xs font-medium transition-all ${
        isOver
          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 scale-[1.02]"
          : "border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30 text-slate-400 dark:text-slate-500 hover:border-slate-300 dark:hover:border-slate-700"
      }`}
    >
      {isOver ? "Thả vào đây" : "Ô trống"}
    </div>
  );
}

export function TeamBox({ teamId, divisionId, onMemberClick }: TeamBoxProps) {
  const {
    getTeamMembers,
    removeFromTeam,
    updateMemberClass,
    updateMemberLane,
    toggleMemberTag,
    updateTeamLane,
    updateTeamName,
  } = useFormationStore();

  const team = useFormationStore((state) => {
    return state.formation?.divisions
      .flatMap((d) => d.teams)
      .find((t) => t.teamId === teamId);
  });
  const teamLane = team?.lane || null;
  const teamName = team?.name || `Team ${teamId}`;

  const laneNames = useFormationStore((state) => {
    return state.formation?.laneNames || DEFAULT_LANE_NAMES;
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState(teamName);

  useEffect(() => {
    setEditNameValue(teamName);
  }, [teamName]);

  const handleSaveName = () => {
    const trimmed = editNameValue.trim();
    if (trimmed && trimmed !== teamName) {
      updateTeamName(teamId, trimmed);
    } else {
      setEditNameValue(teamName);
    }
    setIsEditingName(false);
  };

  const teamMembers = getTeamMembers(teamId);
  const maxMembers = 6;

  // Analyze team health (filter out nulls for health check)
  const teamHealth = checkTeamHealth(
    teamMembers.filter((m): m is Member => m !== null),
    teamId,
  );
  const hasIssues = teamHealth.issues.length > 0;

  const issueMessages = teamHealth.issues.map((issue) => {
    switch (issue) {
      case "no-tank":
        return "Thiếu Thiết Y";
      case "no-healer":
        return "Thiếu Tố Vấn";
      case "too-many-dps":
        return "Quá nhiều DPS (>4)";
      case "under-capacity":
        return `Chưa đủ 6 thành viên`;
      case "over-capacity":
        return "Vượt quá 6 thành viên";
      default:
        return issue;
    }
  });
  const tooltipText = issueMessages.join("\n");

  // Create array of 6 slots with members or null
  const slots = Array.from(
    { length: maxMembers },
    (_, i) => teamMembers[i] || null,
  );

  return (
    <div
      className={`bg-white dark:bg-slate-900/60 border-2 rounded-xl p-4 transition-all duration-200 flex flex-col justify-between relative ${
        hasIssues
          ? "border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.05)] hover:border-amber-500/50"
          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
      }`}
    >
      {/* Warning Badge (Absolute Floating) */}
      {hasIssues && (
        <div className="absolute -top-2 -right-2 z-10 group/tooltip flex-shrink-0">
          <div className="flex items-center justify-center gap-1 text-slate-950 bg-amber-500 hover:bg-amber-400 px-1.5 py-0.5 rounded-full shadow-[0_2px_8px_rgba(245,158,11,0.3)] border-2 border-white dark:border-slate-950 cursor-help transition-all duration-200 hover:scale-105">
            <AlertTriangle size={11} className="stroke-[3] flex-shrink-0" />
            <span className="text-[9px] font-black leading-none">
              {teamHealth.issues.length}
            </span>
          </div>

          {/* Custom Instant Tooltip */}
          <div className="absolute right-0 top-full mt-2 w-52 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xl text-[10px] text-amber-600 dark:text-amber-300 pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-75 z-50 whitespace-pre-line font-medium leading-relaxed">
            {tooltipText}
          </div>
        </div>
      )}

      <div>
        {/* Team Header */}
        <div className="flex items-center justify-between mb-3 border-b border-slate-200/60 dark:border-slate-800/80 pb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            {isEditingName ? (
              <input
                type="text"
                value={editNameValue}
                onChange={(e) => setEditNameValue(e.target.value)}
                onBlur={handleSaveName}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveName();
                  if (e.key === "Escape") {
                    setEditNameValue(teamName);
                    setIsEditingName(false);
                  }
                }}
                className="text-xs font-extrabold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded px-1.5 py-0.5 focus:outline-none focus:border-blue-500 w-24 uppercase tracking-wider"
                autoFocus
              />
            ) : (
              <h3
                onClick={() => setIsEditingName(true)}
                className="font-extrabold text-slate-700 dark:text-slate-200 text-xs sm:text-sm tracking-wider uppercase cursor-pointer hover:text-blue-500 dark:hover:text-blue-400 hover:underline truncate max-w-[110px]"
                title="Nhấp để đổi tên đội"
              >
                {teamName}
              </h3>
            )}
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                teamMembers.length === maxMembers
                  ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 border border-green-200 dark:border-green-800/30"
                  : teamMembers.length > maxMembers
                  ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 border border-red-200 dark:border-red-800/30"
                  : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-transparent"
              }`}
            >
              {teamMembers.length}/{maxMembers}
            </span>
          </div>

          {/* Lane Dropdown Selector */}
          <select
            value={teamLane || "Flex"}
            onChange={(e) => updateTeamLane(teamId, e.target.value as any)}
            className="text-[10px] font-extrabold bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-0.5 text-slate-600 dark:text-slate-350 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer transition-colors"
          >
            <option value="Top">{laneNames.Top.toUpperCase()}</option>
            <option value="Mid">{laneNames.Mid.toUpperCase()}</option>
            <option value="Bot">{laneNames.Bot.toUpperCase()}</option>
            <option value="Flex">{laneNames.Flex.toUpperCase()}</option>
          </select>
        </div>

        {/* Team Members - Each slot is individually droppable */}
        <div className="space-y-2 min-h-[160px]">
          {slots.map((member, index) => (
            <TeamSlot
              key={`slot-${index}`}
              teamId={teamId}
              position={index}
              member={member}
              onUpdateClass={(cls) =>
                member && updateMemberClass(member.id, cls)
              }
              onUpdateLane={(lane) =>
                member && updateMemberLane(member.id, lane)
              }
              onToggleTag={(tag) => member && toggleMemberTag(member.id, tag)}
              onRemove={() => member && removeFromTeam(member.id)}
              onMemberClick={onMemberClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
