import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { ThemeContext } from "./ThemeContext";

import {
  DEFAULT_THEME,
  THEMES,
  THEME_STORAGE_KEY,
} from "./theme.constants";

function readStoredTheme() {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }

  const stored = window.localStorage.getItem(
    THEME_STORAGE_KEY
  );

  if (
    stored === THEMES.LIGHT ||
    stored === THEMES.DARK ||
    stored === THEMES.SYSTEM
  ) {
    return stored;
  }

  return DEFAULT_THEME;
}

function resolveSystemTheme() {
  if (
    typeof window === "undefined" ||
    !window.matchMedia
  ) {
    return THEMES.DARK;
  }

  return window.matchMedia(
    "(prefers-color-scheme: light)"
  ).matches
    ? THEMES.LIGHT
    : THEMES.DARK;
}

function applyThemeToDocument(theme) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.setAttribute(
    "data-theme",
    theme
  );
}

export function ThemeProvider({
  children,
}) {
  const [theme, setThemeState] =
    useState(readStoredTheme);

  const [systemTheme, setSystemTheme] =
    useState(resolveSystemTheme);

  useEffect(() => {
    if (!window.matchMedia) {
      return undefined;
    }

    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: light)"
    );

    const handleChange = (event) => {
      setSystemTheme(
        event.matches
          ? THEMES.LIGHT
          : THEMES.DARK
      );
    };

    mediaQuery.addEventListener(
      "change",
      handleChange
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleChange
      );
    };
  }, []);

  const resolvedTheme =
    theme === THEMES.SYSTEM
      ? systemTheme
      : theme;

  useEffect(() => {
    applyThemeToDocument(
      resolvedTheme
    );
  }, [resolvedTheme]);

  const setTheme = useCallback(
    (nextTheme) => {
      setThemeState(nextTheme);

      window.localStorage.setItem(
        THEME_STORAGE_KEY,
        nextTheme
      );
    },
    []
  );

  const toggleTheme =
    useCallback(() => {
      setTheme(
        resolvedTheme === THEMES.DARK
          ? THEMES.LIGHT
          : THEMES.DARK
      );
    }, [resolvedTheme, setTheme]);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      systemTheme,
      setTheme,
      toggleTheme,
    }),
    [
      theme,
      resolvedTheme,
      systemTheme,
      setTheme,
      toggleTheme,
    ]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}