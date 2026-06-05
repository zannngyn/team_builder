"use client";

import { useState } from "react";
import { useFormationStore } from "@/store/useFormationStore";
import { Upload, FileText } from "lucide-react";

export function RosterImport() {
  const [text, setText] = useState("");
  const importGuildMembers = useFormationStore((s) => s.importGuildMembers);

  const handleImport = () => {
    if (!text.trim()) return;
    importGuildMembers(text);
    setText("");
  };

  return (
    <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md rounded-xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-xl">
      <h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-300 mb-2 flex items-center gap-2 tracking-wider uppercase">
        <Upload size={16} className="text-blue-500" />
        Nhập Danh Sách
      </h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium leading-relaxed">
        Paste danh sách tên thành viên, mỗi tên 1 dòng.
      </p>

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={"Nam\nMinh\nHùng\nLinh"}
          className="w-full h-36 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 rounded-xl p-4 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-700 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-slate-300 dark:focus:border-slate-700 transition-all font-mono"
        />
        <div className="absolute right-3 bottom-3 flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/60 rounded-md px-2 py-0.5">
          <FileText size={10} />
          {text.trim()
            ? `${text.trim().split("\n").filter(Boolean).length} dòng`
            : "0 dòng"}
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 pt-1">
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-450 uppercase tracking-widest">
          {text.trim()
            ? `${text.trim().split("\n").filter(Boolean).length} thành viên chờ`
            : "Sẵn sàng nhập"}
        </span>
        <button
          onClick={handleImport}
          disabled={!text.trim()}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(59,130,246,0.15)] cursor-pointer active:scale-95"
        >
          Thêm
        </button>
      </div>
    </div>
  );
}
