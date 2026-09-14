export const THEME_KEY = "site-theme"

export const getSystemTheme = () => {
  if (typeof window === "undefined") return "sunset"
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "sunset"
}

export const setTheme = (theme, { persist = true } = {}) => {
  if (typeof document === "undefined") return

  document.documentElement.setAttribute("data-theme", theme)
  document.documentElement.style.colorScheme =
    theme === "dark" ? "dark" : "light"
  if (persist) localStorage.setItem(THEME_KEY, theme)
  window.dispatchEvent(new CustomEvent("themechange", { detail: theme }))
}

export const getStoredTheme = () => {
  if (typeof window === "undefined") return "sunset"

  return localStorage.getItem(THEME_KEY) || getSystemTheme()
}

export const applyStoredTheme = () => {
  if (typeof document === "undefined") return

  setTheme(getStoredTheme(), { persist: false })
}
