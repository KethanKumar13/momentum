import { forwardRef } from "react";
import { cn } from "../../../lib/cn";
import styles from "./Textarea.module.css";

export const Textarea = forwardRef(function Textarea(
  {
    label,
    hint,
    error,
    className,
    id,
    rows = 4,
    ...props
  },
  ref
) {
  const fieldId =
    id ??
    label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={cn(styles.group, className)}>
      {label && (
        <label
          htmlFor={fieldId}
          className={styles.label}
        >
          {label}
        </label>
      )}

      <textarea
        ref={ref}
        id={fieldId}
        rows={rows}
        className={cn(
          styles.textarea,
          error && styles.hasError
        )}
        aria-invalid={!!error}
        {...props}
      />

      {error && (
        <p
          className={styles.error}
          role="alert"
        >
          {error}
        </p>
      )}

      {hint && !error && (
        <p className={styles.hint}>
          {hint}
        </p>
      )}
    </div>
  );
}
);