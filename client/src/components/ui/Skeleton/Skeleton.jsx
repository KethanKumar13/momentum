import { cn } from "../../../lib/cn";
import styles from "./Skeleton.module.css";

export function Skeleton({
  className,
  style,
  ...props
}) {
  return (
    <span
      className={cn(
        styles.skeleton,
        className
      )}
      aria-hidden="true"
      style={style}
      {...props}
    />
  );
}
