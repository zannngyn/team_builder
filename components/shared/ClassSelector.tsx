"use client";

import { Class } from "@/types";
import { CLASSES, CLASS_COLORS } from "@/lib/constants/classes";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ClassSelectorProps {
  value: Class | null;
  onChange: (cls: Class | null) => void;
  size?: "sm" | "md" | "lg";
}

export function ClassSelector({
  value,
  onChange,
  size = "md",
}: ClassSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-3 py-1.5 text-xs",
    lg: "px-4 py-2.5 text-sm",
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${sizeClasses[size]} rounded-md border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-350 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-slate-100 transition-all flex items-center gap-1.5 font-bold uppercase tracking-wider cursor-pointer`}
        style={{
          color: value ? CLASS_COLORS[value] : undefined,
          borderColor: value ? `${CLASS_COLORS[value]}40` : undefined,
        }}
      >
        {value || "Phái"}
        <ChevronDown size={10} className="opacity-60" />
      </button>

      {isOpen && (
        <div className="absolute left-0 z-50 mt-1 w-40 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.6)] p-1">
          <button
            type="button"
            onClick={() => {
              onChange(null);
              setIsOpen(false);
            }}
            className="w-full text-left px-2.5 py-1 text-[10px] text-slate-450 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors font-bold uppercase tracking-wider"
          >
            Không
          </button>
          {CLASSES.map((cls) => (
            <button
              key={cls}
              type="button"
              onClick={() => {
                onChange(cls);
                setIsOpen(false);
              }}
              className="w-full text-left px-2.5 py-1.5 text-[10px] font-bold rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 uppercase tracking-wider"
              style={{
                color: CLASS_COLORS[cls],
              }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: CLASS_COLORS[cls] }}
              />
              {cls}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
