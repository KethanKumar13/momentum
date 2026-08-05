import { cn } from "../../../lib/cn";
import styles from "./Avatar.module.css";

function getInitials(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export function Avatar({
  name,
  src,
  size = "md",
  className,
  ...props
}) {
  const initials = getInitials(name);

  return (
    <div
      className={cn(
        styles.avatar,
        styles[size],
        className
      )}
      aria-label={name}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className={styles.img}
        />
      ) : (
        <span className={styles.initials}>
          {initials || "?"}
        </span>
      )}
    </div>
  );
}
