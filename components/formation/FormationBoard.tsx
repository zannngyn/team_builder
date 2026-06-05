"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { useState, useRef, useEffect } from "react";
import { useFormationStore } from "@/store/useFormationStore";
import { ResourcePanel } from "./ResourcePanel";
import { DivisionLayout } from "./DivisionLayout";
import { LaneView } from "./LaneView";
import { MemberCard } from "@/components/shared/MemberCard";
import { PaintModeToolbar } from "@/components/guild-members/PaintModeToolbar";
import {
  LayoutGrid,
  Milestone,
  Wand2,
  Trash2,
  ChevronDown,
  UserMinus,
  AlertTriangle,
} from "lucide-react";

// -----------------------------------------------------------------------
// Clear Board dropdown — mirrors the ClearMenu in MemberList
// -----------------------------------------------------------------------
type ClearBoardAction = "unassign" | "reset" | null;

function ClearBoardMenu() {
  const { removeAllFromTeams, clearAllTeams } = useFormationStore();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<ClearBoardAction>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setPending(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const confirm = () => {
    if (pending === "unassign") removeAllFromTeams();
    if (pending === "reset") clearAllTeams();
    setOpen(false);
    setPending(null);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => {
          setOpen((v) => !v);
          setPending(null);
        }}
        className="flex items-center gap-1.5 px-3 py-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500 dark:text-red-400 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
        title="Clear board options"
      >
        <Trash2 size={13} />
        Clear Board
        <ChevronDown
          size={11}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-50 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden">
          {pending ? (
            /* Confirmation panel */
            <div className="p-4">
              <div className="flex items-start gap-2.5 mb-3">
                <AlertTriangle
                  size={16}
                  className="text-amber-500 mt-0.5 shrink-0"
                />
                <div>
                  <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mb-0.5">
                    {pending === "unassign"
                      ? "Unassign all members?"
                      : "Reset entire formation?"}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {pending === "unassign"
                      ? "Tất cả player sẽ được trả về danh sách chưa phân công. Danh sách thành viên không bị ảnh hưởng."
                      : "Tất cả team assignment và tên formation sẽ được reset về mặc định. Danh sách thành viên không bị ảnh hưởng."}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPending(null)}
                  className="flex-1 py-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirm}
                  className={`flex-1 py-1.5 text-xs font-bold text-white rounded-lg transition-colors ${
                    pending === "reset"
                      ? "bg-red-600 hover:bg-red-500"
                      : "bg-amber-500 hover:bg-amber-400"
                  }`}
                >
                  {pending === "unassign"
                    ? "Yes, unassign all"
                    : "Yes, reset board"}
                </button>
              </div>
            </div>
          ) : (
            /* Option list */
            <>
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Options
                </p>
              </div>
              <button
                onClick={() => setPending("unassign")}
                className="w-full flex items-start gap-3 px-4 py-3 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors text-left"
              >
                <UserMinus
                  size={15}
                  className="text-amber-500 mt-0.5 shrink-0"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Xóa hết player
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Tất cả player sẽ được trả về danh sách chưa phân công.
                  </p>
                </div>
              </button>
              <div className="h-px bg-slate-100 dark:bg-slate-800 mx-3" />
              <button
                onClick={() => setPending("reset")}
                className="w-full flex items-start gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left"
              >
                <Trash2 size={15} className="text-red-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Reset tất cả team và tên
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Xóa tất cả team và reset tên về mặc định. Danh sách thành
                    viên không bị ảnh hưởng.
                  </p>
                </div>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

interface FormationBoardProps {
  captureRef?: React.RefObject<HTMLDivElement | null>;
}

export function FormationBoard({ captureRef }: FormationBoardProps = {}) {
  const {
    assignToTeam,
    removeFromTeam,
    updateMemberLane,
    guildMembers,
    laneView,
    toggleLaneView,
    autoArrangeTeams,
  } = useFormationStore();

  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);
  const [isResourcePanelCollapsed, setIsResourcePanelCollapsed] =
    useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [resourceTab, setResourceTab] = useState<"members" | "skills">(
    "members",
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    // Only handle member drags now (skills use click-to-pick)
    setActiveMemberId(event.active.id as string);
  };

  const handleMemberClick = (memberId: string) => {
    setSelectedMemberId(memberId);
    setResourceTab("skills");
    if (isResourcePanelCollapsed) {
      setIsResourcePanelCollapsed(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveMemberId(null);

    if (!over) return;

    // Handle member drag
    const memberId = active.id as string;
    const targetId = over.id;
    const targetData = over.data.current;

    if (targetId === "unassigned") {
      removeFromTeam(memberId);
    } else if (targetData?.type === "team-slot") {
      // Drop on specific team slot - preserve position
      const { teamId, position } = targetData;
      assignToTeam(memberId, teamId, position);
    } else if (typeof targetId === "number") {
      // Drop on team (backward compatibility)
      assignToTeam(memberId, targetId);
    }
  };

  const activeMember = activeMemberId
    ? guildMembers.find((m) => m.id === activeMemberId)
    : null;

  // Division 1: Teams 1-5
  const division1TeamIds = [1, 2, 3, 4, 5];
  // Division 2: Teams 6-10
  const division2TeamIds = [6, 7, 8, 9, 10];

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
        {/* Left Sidebar: Resource Panel (Members + Skills tabs) */}
        <div
          className={`w-full flex-shrink-0 lg:sticky lg:top-[90px] h-auto lg:h-[calc(100vh-140px)] flex flex-col transition-all duration-300 ${
            isResourcePanelCollapsed ? "lg:w-12" : "lg:w-72"
          }`}
        >
          <ResourcePanel
            isCollapsed={isResourcePanelCollapsed}
            onToggleCollapse={() =>
              setIsResourcePanelCollapsed(!isResourcePanelCollapsed)
            }
            selectedMemberId={selectedMemberId}
            activeTab={resourceTab}
            onTabChange={setResourceTab}
          />
        </div>

        {/* Center Section: Roster Toolbar & Board */}
        <div className="flex-1 min-w-0 space-y-6 w-full">
          {/* Paint Mode Toolbar */}
          {guildMembers.length > 0 && <PaintModeToolbar />}

          {/* View Switcher and Action Toolbar */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 backdrop-blur-md p-4 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-xl">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  if (laneView) toggleLaneView();
                }}
                className={`px-4 py-2 text-xs font-extrabold uppercase tracking-wider rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                  !laneView
                    ? "bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.3)] border border-blue-500/40"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 border border-transparent"
                }`}
              >
                <LayoutGrid size={14} />
                Xem Đội
              </button>
              <button
                onClick={() => {
                  if (!laneView) toggleLaneView();
                }}
                className={`px-4 py-2 text-xs font-extrabold uppercase tracking-wider rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                  laneView
                    ? "bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.3)] border border-blue-500/40"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 border border-transparent"
                }`}
              >
                <Milestone size={14} />
                Xem Lane
              </button>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={autoArrangeTeams}
                disabled={guildMembers.length === 0}
                className="flex-1 sm:flex-none px-4 py-2 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-slate-100 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <Wand2 size={14} className="text-blue-400" />
                Tự động Xếp Đội Hình
              </button>

              <ClearBoardMenu />
            </div>
          </div>

          {/* Board Content */}
          {laneView ? (
            <LaneView />
          ) : (
            <div ref={captureRef} className="space-y-6">
              {/* Division 1 */}
              <DivisionLayout
                divisionId={1}
                teamIds={division1TeamIds}
                onMemberClick={handleMemberClick}
              />

              {/* Division 2 */}
              <DivisionLayout
                divisionId={2}
                teamIds={division2TeamIds}
                onMemberClick={handleMemberClick}
              />
            </div>
          )}
        </div>
      </div>

      {/* Drag Overlay - only for members */}
      <DragOverlay>
        {activeMember && (
          <div className="rotate-3 scale-105 opacity-90 shadow-2xl shadow-blue-500/10">
            <MemberCard member={activeMember} showControls={false} size="sm" />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
