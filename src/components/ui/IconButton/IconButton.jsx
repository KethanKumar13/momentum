import { forwardRef } from "react";
import { cn } from "../../../lib/cn";
import styles from "./IconButton.module.css";

export const IconButton = forwardRef(function IconButton(
  {
    size = "md",
    variant = "ghost",
    label,
    className,
    children,
    type = "button",
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        styles.btn,
        styles[size],
        styles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});