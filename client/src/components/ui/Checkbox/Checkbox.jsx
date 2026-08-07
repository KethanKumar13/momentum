import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { useId } from "react";
import { cn } from "../../../lib/cn";
import styles from "./Checkbox.module.css";

export function Checkbox({
  children,
  className,
  checked,
  onCheckedChange,
  defaultChecked,
  disabled,
  ...props
}) {
  const id = useId();

  return (
    <div className={cn(styles.wrapper, className)}>
      <RadixCheckbox.Root
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        defaultChecked={defaultChecked}
        disabled={disabled}
        className={styles.root}
        {...props}
      >
        <RadixCheckbox.Indicator
          className={styles.indicator}
        >
          <Check
            size={11}
            strokeWidth={3}
          />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>

      {children && (
        <label
          htmlFor={id}
          className={styles.label}
        >
          {children}
        </label>
      )}
    </div>
  );
}