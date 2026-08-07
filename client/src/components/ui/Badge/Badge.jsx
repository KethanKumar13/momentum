import { cn } from "../../../lib/cn";
import styles from "./Badge.module.css";

export function Badge({
  children,
  tone = "default",
  className,
  ...props
}) {
  return (
    <span
      className={cn(
        styles.badge,
        styles[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
