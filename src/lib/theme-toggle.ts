// use-theme-toggle.ts
import { useTheme } from "@/stores/theme-store";
// import type { Theme } from './ThemeStore' // assuming you export the types
export function useThemeToggle() {
  const { colorMode, themeName, setColorMode, setThemeName } = useTheme();

  return {
    theme: colorMode,
    setTheme: setColorMode,
    // Additional theme name controls
    currentTheme: themeName,
    setCurrentTheme: setThemeName,
    // Convenience method to check if dark mode is active
    isDark:
      colorMode === "dark" ||
      (colorMode === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches),
  };
}

// Type exports for convenience
// export type { Theme, ColorMode, ThemeName } from './ThemeStore'
