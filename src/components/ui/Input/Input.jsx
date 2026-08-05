import { forwardRef } from "react";
import { cn } from "../../../lib/cn";
import styles from "./Input.module.css";

export const Input = forwardRef(function Input(
  {
    label,
    hint,
    error,
    leftSlot,
    rightSlot,
    className,
    id,
    ...props
  },
  ref
) {
  const inputId =
    id ??
    label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={cn(styles.group, className)}>
      {label && (
        <label
          htmlFor={inputId}
          className={styles.label}
        >
          {label}
        </label>
      )}

      <div
        className={cn(
          styles.wrapper,
          error && styles.hasError
        )}
      >
        {leftSlot && (
          <span className={styles.slot}>
            {leftSlot}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          className={styles.input}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${inputId}-error`
              : hint
                ? `${inputId}-hint`
                : undefined
          }
          {...props}
        />

        {rightSlot && (
          <span className={styles.slot}>
            {rightSlot}
          </span>
        )}
      </div>

      {error && (
        <p
          id={`${inputId}-error`}
          className={styles.error}
          role="alert"
        >
          {error}
        </p>
      )}

      {hint && !error && (
        <p
          id={`${inputId}-hint`}
          className={styles.hint}
        >
          {hint}
        </p>
      )}
    </div>
  );
});