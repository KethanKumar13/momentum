import { cn } from "../../../lib/cn";
import styles from "./ProgressBar.module.css";

export function ProgressBar({
  value = 0,
  max = 100,
  size = "md",
  showLabel = false,
  className,
  ...props
}) {
  const pct = Math.min(
    100,
    Math.max(0, (value / max) * 100)
  );

  return (
    <div
      className={cn(
        styles.wrapper,
        className
      )}
      {...props}
    >
      {showLabel && (
        <span className={styles.label}>
          {Math.round(pct)}%
        </span>
      )}

      <div
        className={cn(
          styles.track,
          styles[size]
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`${Math.round(pct)}% complete`}
      >
        <div
          className={styles.fill}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
