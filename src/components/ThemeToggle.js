import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { getStoredTheme, setTheme } from "../utils/theme"

const ThemeToggle = () => {
  const [theme, setCurrentTheme] = useState(null)

  useEffect(() => {
    const syncTheme = event =>
      setCurrentTheme(event.detail || document.documentElement.dataset.theme)

    setCurrentTheme(getStoredTheme())
    window.addEventListener("themechange", syncTheme)
    return () => window.removeEventListener("themechange", syncTheme)
  }, [])

  const isDark = theme === "dark"
  const nextTheme = isDark ? "sunset" : "dark"

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
      onClick={() => setTheme(nextTheme)}
    >
      {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </button>
  )
}

export default ThemeToggle
