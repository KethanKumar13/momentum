import { clsx } from "clsx";

/**
 * Concatenate class names conditionally.
 * Thin wrapper so we can swap the implementation later without touching consumers.
 */
export function cn(...inputs) {
  return clsx(inputs);
}