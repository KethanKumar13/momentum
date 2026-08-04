import { cn } from "../../../lib/cn";
import styles from "./Spinner.module.css";

export function Spinner({
  size = "md",
  className,
  label = "Loading...",
  ...props
}) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        styles.spinner,
        styles[size],
        className
      )}
      {...props}
    />
  );
}