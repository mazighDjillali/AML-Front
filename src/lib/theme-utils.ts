// theme-utils.ts
export function getAvailableThemes() {
  // Get all stylesheet rules
  const themes = new Set<string>();

  // Loop through all loaded stylesheets
  for (const sheet of document.styleSheets) {
    try {
      // Access might fail for cross-origin stylesheets
      const rules = sheet.cssRules || sheet.rules;

      for (const rule of rules) {
        if (rule instanceof CSSStyleRule) {
          // Look for selectors with data-theme
          const selector = rule.selectorText;
          const match = selector.match(/\[data-theme=['"]([^'"]+)['"]\]/);
          if (match) {
            themes.add(match[1]);
          }
        }
      }
    } catch (e) {
      console.warn("Could not read stylesheet rules", e);
    }
  }

  // Always include 'default' theme
  themes.add("default");
  //console.log("we found these themes: ", Array.from(themes));

  return Array.from(themes);
}
