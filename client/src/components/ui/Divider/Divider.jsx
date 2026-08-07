import { cn } from "../../../lib/cn";
import styles from "./Divider.module.css";

export function Divider({
  label,
  className,
  ...props
}) {
  if (label) {
    return (
      <div
        className={cn(
          styles.withLabel,
          className
        )}
        {...props}
      >
        <span className={styles.line} />

        <span className={styles.label}>
          {label}
        </span>

        <span className={styles.line} />
      </div>
    );
  }

  return (
    <hr
      className={cn(
        styles.divider,
        className
      )}
      {...props}
    />
  );
}
