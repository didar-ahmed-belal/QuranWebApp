"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export interface Toast {
  id: number;
  message: string;
  kind?: "success" | "info" | "error";
}

interface ToastCtx {
  toasts: Toast[];
  toast: (message: string, kind?: Toast["kind"]) => void;
  dismiss: (id: number) => void;
}

const Ctx = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, kind: Toast["kind"] = "success") => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, message, kind }]);
      setTimeout(() => dismiss(id), 2200);
    },
    [dismiss]
  );

  return <Ctx.Provider value={{ toasts, toast, dismiss }}>{children}</Ctx.Provider>;
}

export function useToast() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useToast must be inside ToastProvider");
  return c;
}

export function Toaster() {
  const { toasts, dismiss } = useToast();
  // Avoid hydration mismatch: only render on client
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => dismiss(t.id)}
          className={`pointer-events-auto cursor-pointer rounded-lg border px-4 py-2 text-sm shadow-lg backdrop-blur transition-all ${
            t.kind === "error"
              ? "border-red-500/40 bg-red-500/15 text-red-200"
              : t.kind === "info"
                ? "border-border bg-bg-elevated text-text"
                : "border-accent/40 bg-accent/15 text-accent"
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
