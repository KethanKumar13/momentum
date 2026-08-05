import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-strong)",
          color: "var(--text-primary)",
          fontFamily: "var(--font-ui)",
          fontSize: "0.875rem",
          borderRadius: "var(--radius-md)",
          boxShadow: "var(--shadow-md)",
        },
        duration: 4000,
      }}
    />
  );
}