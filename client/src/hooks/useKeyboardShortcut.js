import { useHotkeys } from "react-hotkeys-hook";

/**
 * Thin wrapper around react-hotkeys-hook so consumers can migrate later.
 * Example:
 * useKeyboardShortcut("mod+k", () => open())
 */
export function useKeyboardShortcut(keys, callback, options) {
  return useHotkeys(keys, callback, options);
}