import { forwardRef } from "react";
import { cn } from "../../../lib/cn";
import styles from "./Button.module.css";

export const Button = forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    disabled,
    leftIcon,
    rightIcon,
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
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        styles.btn,
        styles[variant],
        styles[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <span
          className={styles.spinner}
          aria-hidden="true"
        />
      ) : (
        leftIcon
      )}

      <span>{children}</span>

      {!loading && rightIcon}
    </button>
  );
});