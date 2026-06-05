"use client";

import { X, Heart } from "lucide-react";
import { useEffect } from "react";

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DonateModal({ isOpen, onClose }: DonateModalProps) {
  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Heart className="text-red-500" size={24} fill="currentColor" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Support Development
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X size={20} className="text-slate-500 dark:text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Message */}
          <p className="text-center text-slate-600 dark:text-slate-400 leading-relaxed">
            Nếu thấy Tool hữu ích, có thể ủng hộ để mình có thêm động lực nhé.
            Thank you! ❤️
          </p>
          <p className="text-center text-slate-600 dark:text-slate-400 leading-relaxed">
            Ingame: Thiên Ý - Rising Lotus
          </p>
          {/* QR Code */}
          <div className="flex justify-center">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 border-2 border-slate-200 dark:border-slate-700">
              {/* Placeholder for QR code - replace with actual image */}
              <img
                src="/assest/qrcode.jpg"
                alt="Donation QR Code"
                className="w-64 h-64 object-contain"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              {/* Fallback placeholder */}
              <div className="hidden w-64 h-64 flex-col items-center justify-center text-slate-400 dark:text-slate-600">
                <Heart size={48} className="mb-2" />
                <p className="text-sm">QR Code</p>
                <p className="text-xs mt-1">Add /qr-code-donate.png</p>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-xs text-center text-slate-500 dark:text-slate-500">
            Scan with your banking app or e-wallet
          </p>
        </div>
      </div>
    </div>
  );
}
