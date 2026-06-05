"use client";

import { useFormationStore } from "@/store/useFormationStore";
import { MemberCard } from "@/components/shared/MemberCard";
import {
  Users,
  Search,
  Filter,
  RefreshCw,
  Trash2,
  ChevronDown,
  UserMinus,
  AlertTriangle,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { CLASSES } from "@/lib/constants/classes";
import { LANES } from "@/lib/constants/lanes";
import { Class, Lane } from "@/types";

// -------------------------------------------------------------------
// Inline confirmation banner that replaces itself after a click
// -------------------------------------------------------------------
type ConfirmAction = "kick" | "delete" | null;

function ClearMenu() {
  const { removeAllFromTeams, clearAllGuildMembers } = useFormationStore();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<ConfirmAction>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
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
    if (pending === "kick") removeAllFromTeams();
    if (pending === "delete") clearAllGuildMembers();
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
        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500 dark:text-red-400 rounded-lg text-xs font-bold transition-colors"
        title="Tùy chọn xóa"
      >
        <Trash2 size={13} />
        Xóa
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
                    {pending === "kick"
                      ? "Xóa tất cả khỏi đội?"
                      : "Xóa tất cả thành viên bang hội?"}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    {pending === "kick"
                      ? "Tất cả thành viên sẽ được chuyển về kho. Dữ liệu được bảo toàn."
                      : "Tất cả thành viên và phân công đội sẽ bị xóa vĩnh viễn khỏi bộ nhớ cache. Không thể hoàn tác."}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPending(null)}
                  className="flex-1 py-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={confirm}
                  className={`flex-1 py-1.5 text-xs font-bold text-white rounded-lg transition-colors ${
                    pending === "delete"
                      ? "bg-red-600 hover:bg-red-500"
                      : "bg-amber-500 hover:bg-amber-400"
                  }`}
                >
                  {pending === "kick" ? "Có, xóa tất cả" : "Có, xóa tất cả"}
                </button>
              </div>
            </div>
          ) : (
            /* Option list */
            <>
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Tùy chọn xóa
                </p>
              </div>
              <button
                onClick={() => setPending("kick")}
                className="w-full flex items-start gap-3 px-4 py-3 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors text-left"
              >
                <UserMinus
                  size={15}
                  className="text-amber-500 mt-0.5 shrink-0"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Xóa tất cả khỏi đội
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Chuyển tất cả về kho. Thành viên vẫn trong danh sách.
                  </p>
                </div>
              </button>
              <div className="h-px bg-slate-100 dark:bg-slate-800 mx-3" />
              <button
                onClick={() => setPending("delete")}
                className="w-full flex items-start gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left"
              >
                <Trash2 size={15} className="text-red-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Xóa tất cả thành viên bang hội
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Xóa toàn bộ danh sách + xóa bộ nhớ cache. Không thể hoàn
                    tác.
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

export function MemberList() {
  const {
    guildMembers,
    paintMode,
    updateMemberClass,
    updateMemberLane,
    toggleMemberTag,
    removeMember,
    paintMember,
  } = useFormationStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<Class | "All">("All");
  const [selectedLane, setSelectedLane] = useState<Lane | "All" | "None">(
    "All",
  );

  if (guildMembers.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md rounded-xl p-12 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-xl">
        <Users
          size={40}
          className="mx-auto text-slate-300 dark:text-slate-700 mb-4"
        />
        <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-300 mb-1 tracking-wider uppercase">
          Chưa có thành viên bang hội
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Nhập danh sách ở trên để bắt đầu
        </p>
      </div>
    );
  }

  const handleMemberClick = (memberId: string) => {
    if (paintMode.active) {
      paintMember(memberId);
    }
  };

  // Filter members based on search and selected options
  const filteredMembers = guildMembers.filter((m) => {
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

  return (
    <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-xl">
      {/* Header and Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/10 border border-blue-500/30 rounded-xl text-blue-500 dark:text-blue-400">
            <Users size={16} />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-300 tracking-wider uppercase">
              Thành Viên Bang Hội
            </h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
              ({guildMembers.length} thành viên)
            </p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 focus:border-blue-500 rounded-lg text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-700 focus:outline-none transition-all w-40"
            />
          </div>

          {/* Class Filter */}
          <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
            <Filter size={12} className="opacity-60 mr-1" />
            <select
              value={selectedClass}
              onChange={(e) =>
                setSelectedClass(e.target.value as Class | "All")
              }
              className="bg-transparent py-1.5 text-xs font-semibold focus:outline-none cursor-pointer pr-1 text-slate-700 dark:text-slate-300"
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
          <div className="flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
            <Filter size={12} className="opacity-60 mr-1" />
            <select
              value={selectedLane}
              onChange={(e) =>
                setSelectedLane(e.target.value as Lane | "All" | "None")
              }
              className="bg-transparent py-1.5 text-xs font-semibold focus:outline-none cursor-pointer pr-1 text-slate-700 dark:text-slate-300"
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

          {/* Reset Filters */}
          {(searchTerm ||
            selectedClass !== "All" ||
            selectedLane !== "All") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedClass("All");
                setSelectedLane("All");
              }}
              className="p-2 text-slate-400 hover:text-slate-800 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
              title="Đặt lại bộ lọc"
            >
              <RefreshCw size={14} />
            </button>
          )}

          {/* Clear Actions */}
          <ClearMenu />
        </div>
      </div>

      {/* Grid of cards */}
      {filteredMembers.length === 0 ? (
        <div className="h-32 flex items-center justify-center text-slate-400 dark:text-slate-600 text-xs font-medium border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          Không có thành viên nào phù hợp
        </div>
      ) : (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${
            paintMode.active ? "cursor-crosshair" : ""
          }`}
        >
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              onClick={() => handleMemberClick(member.id)}
              className={paintMode.active ? "cursor-pointer" : ""}
            >
              <MemberCard
                member={member}
                onUpdateClass={(cls) => updateMemberClass(member.id, cls)}
                onUpdateLane={(lane) => updateMemberLane(member.id, lane)}
                onToggleTag={(tag) => toggleMemberTag(member.id, tag)}
                onRemove={() => removeMember(member.id)}
                showControls={!paintMode.active}
                size="md"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
