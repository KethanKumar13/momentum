import { useFocusTimer } from "@/hooks/useFocusTimer";
import { Play, Pause, RotateCcw } from "lucide-react";
import styles from "./FocusTimer.module.css";

const MODES = [
  { key: "focus", label: "Focus" },
  { key: "short", label: "Short break" },
  { key: "long", label: "Long break" },
];

export function FocusTimer() {
  const {
    mode,
    minutes,
    seconds,
    progress,
    running,
    toggle,
    reset,
    switchMode,
  } = useFocusTimer();

  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference * (1 - progress);

  return (
    <div
      className={styles.card}
      role="timer"
      aria-label="Focus timer"
    >
      {/* Mode tabs */}
      <div
        className={styles.tabs}
        role="tablist"
        aria-label="Timer modes"
      >
        {MODES.map((timerMode) => (
          <button
            key={timerMode.key}
            role="tab"
            aria-selected={mode === timerMode.key}
            className={`${styles.tab} ${
              mode === timerMode.key ? styles.activeTab : ""
            }`}
            onClick={() => switchMode(timerMode.key)}
          >
            {timerMode.label}
          </button>
        ))}
      </div>

      {/* Ring */}
      <div
        className={styles.ring}
        aria-hidden="true"
      >
        <svg
          width="128"
          height="128"
          viewBox="0 0 128 128"
        >
          <circle
            cx="64"
            cy="64"
            r="54"
            className={styles.track}
          />

          <circle
            cx="64"
            cy="64"
            r="54"
            className={styles.progress}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{
              transition: running
                ? "stroke-dashoffset 1s linear"
                : "none",
            }}
          />
        </svg>

        <div className={styles.time}>
          <span>
            {minutes}:{seconds}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <button
          className={styles.resetBtn}
          onClick={reset}
          aria-label="Reset timer"
          title="Reset"
        >
          <RotateCcw size={16} />
        </button>

        <button
          className={`${styles.playBtn} ${
            running ? styles.pause : styles.play
          }`}
          onClick={toggle}
          aria-label={running ? "Pause timer" : "Start timer"}
        >
          {running ? (
            <Pause size={20} />
          ) : (
            <Play size={20} />
          )}
        </button>
      </div>
    </div>
  );
}