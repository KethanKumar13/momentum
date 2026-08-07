import { cn } from "../../../lib/cn";
import styles from "./EmptyState.module.css";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        styles.container,
        className
      )}
      {...props}
    >
      {icon && (
        <div
          className={styles.icon}
          aria-hidden="true"
        >
          {icon}
        </div>
      )}

      {title && (
        <h3 className={styles.title}>
          {title}
        </h3>
      )}

      {description && (
        <p className={styles.description}>
          {description}
        </p>
      )}

      {action && (
        <div className={styles.action}>
          {action}
        </div>
      )}
    </div>
  );
}
