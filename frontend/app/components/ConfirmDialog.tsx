"use client";

import { useEffect } from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Ya, Hapus",
  cancelText = "Batal",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-4 rounded-full">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
          {title}
        </h2>
        <p className="text-gray-600 text-center mb-6">
          {message}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-red-500 text-white font-semibold rounded-2xl hover:bg-red-600 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}