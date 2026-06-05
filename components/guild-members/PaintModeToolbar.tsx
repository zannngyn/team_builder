"use client";

import { useFormationStore } from "@/store/useFormationStore";
import { CLASS_COLORS, CLASSES } from "@/lib/constants/classes";
import { Paintbrush } from "lucide-react";

export function PaintModeToolbar() {
  const { paintMode, togglePaintMode, setPaintClass } = useFormationStore();

  return (
    <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-600/10 border border-blue-500/30 rounded-xl text-blue-400 mt-0.5">
            <Paintbrush size={16} />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-300 tracking-wider uppercase">
              Paint Mode
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 leading-relaxed">
              Chọn nhanh môn phái cho thành viên bằng cách chọn màu class dưới
              đây và nhấp trực tiếp vào thẻ người chơi.
            </p>
          </div>
        </div>

        <button
          onClick={togglePaintMode}
          className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border cursor-pointer ${
            paintMode.active
              ? "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] border-blue-500/40 active:scale-95"
              : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-slate-100"
          }`}
        >
          {paintMode.active ? "Đang bật" : "Bật Paint Mode"}
        </button>
      </div>

      {paintMode.active && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/80">
          <p className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
            Chọn môn phái:
          </p>
          <div className="flex flex-wrap gap-2.5">
            {CLASSES.map((cls) => {
              const isSelected = paintMode.selectedClass === cls;
              const classColor = CLASS_COLORS[cls];

              return (
                <button
                  key={cls}
                  onClick={() => setPaintClass(cls)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border active:scale-95 cursor-pointer ${
                    isSelected
                      ? "bg-slate-100 dark:bg-slate-900 border-2 shadow-[0_0_10px_rgba(59,130,246,0.05)]"
                      : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-950/60 dark:hover:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-450 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                  style={{
                    borderColor: isSelected ? classColor : undefined,
                    color: isSelected ? classColor : undefined,
                    boxShadow: isSelected
                      ? `0 0 12px ${classColor}20`
                      : undefined,
                  }}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: classColor }}
                  />
                  {cls}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
