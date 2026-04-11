"use client";

import { createContext, useContext, useMemo, useState } from "react";

type ToastType = "success" | "error" | "info";

type Toast = {
  id: number;
  type: ToastType;
  message: string;
};

interface ToastContextValue {
  notify: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = (message: string, type: ToastType = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  const value = useMemo(() => ({ notify }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`max-w-sm min-w-[240px] rounded-2xl border px-4 py-3 shadow-xl transition-all duration-300 ${
              toast.type === "success"
                ? "bg-[#0f5132] text-white border-[#0f5132]"
                : toast.type === "error"
                ? "bg-[#842029] text-white border-[#842029]"
                : "bg-[#084298] text-white border-[#084298]"
            }`}
          >
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
