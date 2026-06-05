"use client";

import { useFormationStore } from "@/store/useFormationStore";
import { MemberCard } from "@/components/shared/MemberCard";
import { useDroppable } from "@dnd-kit/core";
import { LANE_COLORS } from "@/lib/constants/lanes";
import { Lane } from "@/types";
import { useState, useEffect } from "react";

interface LaneColumnProps {
  laneId: Lane | "None";
  title: string;
  color: string;
  members: any[];
}

function LaneColumn({ laneId, title, color, members }: LaneColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: laneId === "None" ? "lane-None" : `lane-${laneId}`,
  });

  const { 
    updateMemberClass, 
    updateMemberLane, 
    toggleMemberTag, 
    removeFromTeam,
    updateLaneName 
  } = useFormationStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitleValue, setEditTitleValue] = useState(title);

  useEffect(() => {
    setEditTitleValue(title);
  }, [title]);

  const handleSaveTitle = () => {
    const trimmed = editTitleValue.trim();
    if (trimmed && trimmed !== title && laneId !== "None") {
      updateLaneName(laneId, trimmed);
    } else {
      setEditTitleValue(title);
    }
    setIsEditingTitle(false);
  };

  return (
    <div
      ref={setNodeRef}
      className={`bg-white dark:bg-slate-900/60 border-2 rounded-xl p-4 transition-all duration-200 min-h-[300px] flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-xl ${
        isOver
          ? "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.25)] bg-slate-50 dark:bg-slate-900/80 scale-[1.01]"
          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
      }`}
    >
      <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
          {isEditingTitle && laneId !== "None" ? (
            <input
              type="text"
              value={editTitleValue}
              onChange={(e) => setEditTitleValue(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveTitle();
                if (e.key === "Escape") {
                  setEditTitleValue(title);
                  setIsEditingTitle(false);
                }
              }}
              className="text-xs font-extrabold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-0.5 focus:outline-none focus:border-blue-500 w-28 uppercase tracking-wider"
              autoFocus
            />
          ) : (
            <h3
              onClick={() => {
                if (laneId !== "None") {
                  setIsEditingTitle(true);
                }
              }}
              className={`font-extrabold text-slate-700 dark:text-slate-200 text-xs sm:text-sm tracking-wider uppercase truncate ${
                laneId !== "None" ? "cursor-pointer hover:text-blue-500 dark:hover:text-blue-400 hover:underline" : ""
              }`}
              title={laneId !== "None" ? "Click to rename lane" : undefined}
            >
              {title}
            </h3>
          )}
        </div>
        <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full border border-slate-200 dark:border-slate-700/60 flex-shrink-0">
          {members.length}
        </span>
      </div>

      <div className="space-y-2.5 flex-1">
        {members.length === 0 ? (
          <div className="h-full min-h-[200px] flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-800/80 rounded-xl text-slate-400 dark:text-slate-600 text-xs font-semibold">
            Drag players here to assign
          </div>
        ) : (
          members.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onUpdateClass={(cls) => updateMemberClass(member.id, cls)}
              onUpdateLane={(l) => updateMemberLane(member.id, l)}
              onToggleTag={(tag) => toggleMemberTag(member.id, tag)}
              onRemove={() => removeFromTeam(member.id)}
              showControls={true}
              draggable={true}
              size="sm"
              isCompact={true}
            />
          ))
        )}
      </div>
    </div>
  );
}

const DEFAULT_LANE_NAMES = {
  Top: "Top",
  Mid: "Mid",
  Bot: "Bot",
  Flex: "Flex",
};

export function LaneView() {
  const { guildMembers, getUnassignedMembers, formation } = useFormationStore();
  const unassigned = getUnassignedMembers();
  const unassignedIds = new Set(unassigned.map((m) => m.id));

  // Get active roster members (players assigned to teams)
  const activeMembers = guildMembers.filter((m) => !unassignedIds.has(m.id));

  // Create a map of memberId -> lane
  const memberLaneMap = new Map<string, Lane | null>();
  if (formation) {
    formation.divisions.forEach((div) => {
      div.teams.forEach((team) => {
        const teamLane = team.lane || null;
        team.members.forEach((memberId) => {
          memberLaneMap.set(memberId, teamLane);
        });
      });
    });
  }

  const topMembers = activeMembers.filter((m) => memberLaneMap.get(m.id) === "Top");
  const midMembers = activeMembers.filter((m) => memberLaneMap.get(m.id) === "Mid");
  const botMembers = activeMembers.filter((m) => memberLaneMap.get(m.id) === "Bot");
  const flexMembers = activeMembers.filter((m) => memberLaneMap.get(m.id) === "Flex");
  const noLaneMembers = activeMembers.filter((m) => memberLaneMap.get(m.id) === null || !memberLaneMap.has(m.id));

  const laneNames = useFormationStore((state) => {
    return state.formation?.laneNames || DEFAULT_LANE_NAMES;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <LaneColumn
        laneId="Top"
        title={laneNames.Top}
        color={LANE_COLORS.Top}
        members={topMembers}
      />
      <LaneColumn
        laneId="Mid"
        title={laneNames.Mid}
        color={LANE_COLORS.Mid}
        members={midMembers}
      />
      <LaneColumn
        laneId="Bot"
        title={laneNames.Bot}
        color={LANE_COLORS.Bot}
        members={botMembers}
      />
      <LaneColumn
        laneId="Flex"
        title={laneNames.Flex}
        color={LANE_COLORS.Flex}
        members={flexMembers}
      />
      <LaneColumn
        laneId="None"
        title="Unassigned Lane"
        color="#475569" // slate-600
        members={noLaneMembers}
      />
    </div>
  );
}
