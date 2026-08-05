import * as RadixSwitch from "@radix-ui/react-switch";
import { cn } from "../../../lib/cn";
import styles from "./Switch.module.css";

export function Switch({
  className,
  label,
  ...props
}) {
  return (
    <div className={cn(styles.wrapper, className)}>
      {label && (
        <span className={styles.label}>
          {label}
        </span>
      )}

      <RadixSwitch.Root
        className={styles.root}
        {...props}
      >
        <RadixSwitch.Thumb
          className={styles.thumb}
        />
      </RadixSwitch.Root>
    </div>
  );
}
