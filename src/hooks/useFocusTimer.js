import { useState, useEffect, useCallback, useRef } from "react";

const MODES = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};

export function useFocusTimer() {
  const [mode, setMode] = useState("focus");
  const [secondsLeft, setSecondsLeft] = useState(MODES.focus);
  const [running, setRunning] = useState(false);

  const intervalRef = useRef(null);

  const tick = useCallback(() => {
    setSecondsLeft((seconds) => {
      if (seconds <= 1) {
        clearInterval(intervalRef.current);
        setRunning(false);
        return 0;
      }

      return seconds - 1;
    });
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [running, tick]);

  const switchMode = useCallback((newMode) => {
    setRunning(false);
    setMode(newMode);
    setSecondsLeft(MODES[newMode]);
  }, []);

  const toggle = useCallback(() => {
    setRunning((value) => !value);
  }, []);

  const reset = useCallback(() => {
    setRunning(false);
    setSecondsLeft(MODES[mode]);
  }, [mode]);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");
  const progress = 1 - secondsLeft / MODES[mode];

  return {
    mode,
    modes: MODES,
    minutes,
    seconds,
    progress,
    running,
    toggle,
    reset,
    switchMode,
  };
}