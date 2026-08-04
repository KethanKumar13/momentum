import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../../lib/cn";
import styles from "./Select.module.css";

export const Select = forwardRef(function Select(
  {
    label,
    hint,
    error,
    options = [],
    className,
    placeholder = "Select...",
    id,
    ...props
  },
  ref
) {
  const fieldId =
    id ?? label?.toLowerCase().replace(/\s+/g, "-");

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

      <div
        className={cn(
          styles.wrapper,
          error && styles.hasError
        )}
      >
        <select
          ref={ref}
          id={fieldId}
          className={styles.select}
          aria-invalid={!!error}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
            >
              {opt.label}
            </option>
          ))}
        </select>

        <ChevronDown
          size={16}
          className={styles.icon}
          aria-hidden="true"
        />
      </div>

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
});