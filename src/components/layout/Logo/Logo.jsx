import { cn } from "../../../lib/cn";

export function Logo({ collapsed = false, className }) {
  return (
    <div
      className={cn(className)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--sp-2)",
        overflow: "hidden",
      }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="logo-g"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#7C5CFF" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
        </defs>

        <rect
          width="64"
          height="64"
          rx="14"
          fill="#08090D"
        />

        <path
          d="M14 46 L14 22 L24 34 L32 22 L40 34 L50 22 L50 46"
          fill="none"
          stroke="url(#logo-g)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {!collapsed && (
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "1.15rem",
            background: "var(--grad-momentum)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            whiteSpace: "nowrap",
          }}
        >
          Momentum
        </span>
      )}
    </div>
  );
}