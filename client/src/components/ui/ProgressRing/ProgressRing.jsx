import { cn } from "../../../lib/cn";
import styles from "./ProgressRing.module.css";

export function ProgressRing({
  value = 0,
  max = 100,
  size = 64,
  strokeWidth = 5,
  className,
  children,
  ...props
}) {
  const pct = Math.min(
    100,
    Math.max(0, (value / max) * 100)
  );

  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (pct / 100) * circumference;

  return (
    <div
      className={cn(
        styles.wrapper,
        className
      )}
      style={{
        width: size,
        height: size,
      }}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      {...props}
    >
      <svg
        width={size}
        height={size}
        className={styles.svg}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className={styles.track}
          fill="none"
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className={styles.fill}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition:
              "stroke-dashoffset var(--dur-slow) var(--ease-out)",
          }}
        />
      </svg>

      {children && (
        <div className={styles.inner}>
          {children}
        </div>
      )}
    </div>
  );
}
