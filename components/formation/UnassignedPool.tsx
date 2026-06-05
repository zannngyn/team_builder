"use client";

import { useFormationStore } from "@/store/useFormationStore";
import { MemberCard } from "@/components/shared/MemberCard";
import { useDroppable } from "@dnd-kit/core";
import { useState } from "react";
import {
  Search,
  Filter,
  RefreshCw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { CLASSES } from "@/lib/constants/classes";
import { LANES } from "@/lib/constants/lanes";
import { Class, Lane } from "@/types";

interface UnassignedPoolProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function UnassignedPool({
  isCollapsed,
  onToggleCollapse,
}: UnassignedPoolProps) {
  const {
    getUnassignedMembers,
    updateMemberClass,
    updateMemberLane,
    toggleMemberTag,
    removeMember,
    loadSampleRoster,
    guildMembers,
  } = useFormationStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<Class | "All">("All");
  const [selectedLane, setSelectedLane] = useState<Lane | "All" | "None">(
    "All",
  );

  const unassignedMembers = getUnassignedMembers();

  // Filter members based on search and selected options
  const filteredMembers = unassignedMembers.filter((m) => {
    const matchesSearch = m.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === "All" || m.class === selectedClass;

    let matchesLane = true;
    if (selectedLane === "None") {
      matchesLane = m.lane === null;
    } else if (selectedLane !== "All") {
      matchesLane = m.lane === selectedLane;
    }

    return matchesSearch && matchesClass && matchesLane;
  });

  // Set up dnd-kit droppable
  const { isOver, setNodeRef } = useDroppable({
    id: "unassigned",
  });

  return (
    <div
      ref={setNodeRef}
      className={`bg-white dark:bg-slate-900/60 border-2 rounded-xl flex flex-col h-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-2xl transition-all duration-300 ${
        isOver
          ? "border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.15)] bg-slate-50 dark:bg-slate-900/90"
          : "border-slate-200 dark:border-slate-800"
      } ${isCollapsed ? "p-2" : "p-4"}`}
    >
      {/* Collapse/Expand Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-4 z-10 p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg transition-all border-2 border-white dark:border-slate-900"
        title={isCollapsed ? "Mở rộng" : "Thu gọn"}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {isCollapsed ? (
        /* Collapsed View - Vertical Bar */
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="writing-mode-vertical text-xs font-black text-slate-700 dark:text-slate-300 tracking-wider uppercase whitespace-nowrap rotate-180">
            Kho Thành Viên
          </div>
          <div className="px-2 py-1 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-lg">
            <span className="text-xs font-black text-blue-600 dark:text-blue-400">
              {unassignedMembers.length}
            </span>
          </div>
        </div>
      ) : (
        /* Expanded View - Full Pool */
        <>
          {/* Header and Controls */}
          <div className="flex flex-col gap-3 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800/80 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-black text-slate-800 dark:text-slate-200 tracking-widest uppercase">
                  Kho Thành Viên
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60 rounded-full">
                  {unassignedMembers.length}
                </span>
              </div>
              {(searchTerm ||
                selectedClass !== "All" ||
                selectedLane !== "All") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedClass("All");
                    setSelectedLane("All");
                  }}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                  title="Đặt lại bộ lọc"
                >
                  <RefreshCw size={12} />
                </button>
              )}
            </div>

            {/* Filter Toolbar - Stacked for Sidebar */}
            <div className="flex flex-col gap-2">
              {/* Search */}
              <div className="relative">
                <Search
                  size={12}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 focus:border-blue-500 rounded-lg text-[10px] text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-700 focus:outline-none transition-all"
                />
              </div>

              {/* Class Filter */}
              <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 transition-all w-full">
                <Filter size={10} className="opacity-60 mr-1" />
                <select
                  value={selectedClass}
                  onChange={(e) =>
                    setSelectedClass(e.target.value as Class | "All")
                  }
                  className="bg-transparent py-1.5 text-[10px] font-bold focus:outline-none cursor-pointer pr-1 w-full text-slate-700 dark:text-slate-300"
                >
                  <option
                    value="All"
                    className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-300"
                  >
                    Tất cả Phái
                  </option>
                  {CLASSES.map((c) => (
                    <option
                      key={c}
                      value={c}
                      className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-300"
                    >
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lane Filter */}
              <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 transition-all w-full">
                <Filter size={10} className="opacity-60 mr-1" />
                <select
                  value={selectedLane}
                  onChange={(e) =>
                    setSelectedLane(e.target.value as Lane | "All" | "None")
                  }
                  className="bg-transparent py-1.5 text-[10px] font-bold focus:outline-none cursor-pointer pr-1 w-full text-slate-700 dark:text-slate-300"
                >
                  <option
                    value="All"
                    className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-300"
                  >
                    Tất cả Đường
                  </option>
                  <option
                    value="None"
                    className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-300"
                  >
                    Không Lane
                  </option>
                  {LANES.map((l) => (
                    <option
                      key={l}
                      value={l}
                      className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-300"
                    >
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Roster Cards List - Scrollable Vertical Column */}
          <div className="flex-1 rounded-xl p-2 bg-slate-50/50 dark:bg-slate-950/20 border border-dashed border-slate-200 dark:border-slate-800/80 overflow-y-auto max-h-[calc(100vh-290px)] min-h-[300px] custom-scrollbar">
            {guildMembers.length === 0 ? (
              <div className="h-full min-h-[250px] flex flex-col items-center justify-center gap-3 text-center">
                <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold">
                  Danh sách bang hội trống
                </p>
                <button
                  onClick={loadSampleRoster}
                  className="px-3 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-600/10 dark:hover:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 hover:border-blue-500 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-[10px] font-black uppercase tracking-wider rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.05)]"
                >
                  <Sparkles size={11} />
                  Tải Dữ Liệu Mẫu
                </button>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="h-full min-h-[250px] flex items-center justify-center text-slate-400 dark:text-slate-600 text-xs font-semibold">
                Không tìm thấy thành viên
              </div>
            ) : (
              <div className="flex flex-col gap-2 pr-1">
                {filteredMembers.map((member) => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    onUpdateClass={(cls) => updateMemberClass(member.id, cls)}
                    onUpdateLane={(lane) => updateMemberLane(member.id, lane)}
                    onToggleTag={(tag) => toggleMemberTag(member.id, tag)}
                    onRemove={() => removeMember(member.id)}
                    showControls={true}
                    draggable={true}
                    size="sm"
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
