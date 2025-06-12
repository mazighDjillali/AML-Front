// theme-store.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
// import type {} from '@redux-devtools/extension';
import { getAvailableThemes } from "@/lib/theme-utils";

type ColorMode = "light" | "dark" | "system";

interface ThemeState {
  colorMode: ColorMode;
  themeName: string;
  availableThemes: string[];
  setColorMode: (mode: ColorMode) => void;
  setThemeName: (name: string) => void;
  refreshThemes: () => void;
}

export const useTheme = create<ThemeState>()(
  devtools(
    persist(
      (set, get) => ({
        colorMode: "system",
        themeName: "default",
        availableThemes: [],
        setColorMode: (colorMode) => {
          set({ colorMode });
          updateTheme({ colorMode, themeName: get().themeName });
        },
        setThemeName: (themeName) => {
          if (get().availableThemes.includes(themeName)) {
            set({ themeName });
            updateTheme({ colorMode: get().colorMode, themeName });
          }
        },
        refreshThemes: () => {
          const themes = getAvailableThemes();

          if (!haveSameElements(themes, get().availableThemes)) {
            set({ availableThemes: themes });
          }
        },
      }),
      {
        name: "theme-store",
        partialize: (state) => ({
          colorMode: state.colorMode,
          themeName: state.themeName,
        }),
      },
    ),
  ),
);

function updateTheme({
  colorMode,
  themeName,
}: {
  colorMode: ColorMode;
  themeName: string;
}) {
  // Handle dark mode
  const isDark =
    colorMode === "dark" ||
    (colorMode === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  document.documentElement.classList.toggle("dark", isDark);

  // Handle theme
  document.documentElement.setAttribute("data-theme", themeName);
}

export function initializeTheme() {
  const store = useTheme.getState();

  store.refreshThemes();

  updateTheme({
    colorMode: store.colorMode,
    themeName: store.themeName,
  });
  // Handle system theme changes
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", () => {
    const { colorMode, themeName } = useTheme.getState();
    updateTheme({ colorMode, themeName });
  });

  // Handle theme changes from other tabs
  window.addEventListener("storage", (event) => {
    if (event.key === "theme-store") {
      const newState = JSON.parse(event.newValue || "{}").state;
      if (newState) {
        updateTheme({
          colorMode: newState.colorMode,
          themeName: newState.themeName,
        });
      }
    }
  });
}

function haveSameElements(a: Array<string>, b: Array<string>) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    [...a].sort().every((val, index) => [...b].sort()[index] === val)
  );
}
