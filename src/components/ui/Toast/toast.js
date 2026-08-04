import { toast as sonnerToast } from "sonner";

export const toast = {
  success: (msg) => sonnerToast.success(msg),
  error: (msg) => sonnerToast.error(msg),
  info: (msg) => sonnerToast.message(msg),
  warning: (msg) => sonnerToast.warning(msg),
  promise: (...args) => sonnerToast.promise(...args),
};