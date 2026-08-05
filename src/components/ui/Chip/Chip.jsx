import { X } from "lucide-react";
import { cn } from "../../../lib/cn";
import styles from "./Chip.module.css";

export function Chip({
  children,
  onRemove,
  active = false,
  className,
  ...props
}) {
  return (
    <span
      className={cn(
        styles.chip,
        active && styles.active,
        className
      )}
      {...props}
    >
      {children}

      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className={styles.remove}
          aria-label="Remove"
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
}
