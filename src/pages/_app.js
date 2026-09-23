import React, { useEffect } from "react"
import Script from "next/script"
import { IBM_Plex_Mono, Inter, Newsreader } from "next/font/google"
import "../styles/global.css"
import {
  applyStoredTheme,
  getSystemTheme,
  setTheme,
  THEME_KEY,
} from "../utils/theme"

// Self-hosted at build time by next/font; exposed as CSS variables for the type roles in global.css.
const serif = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-serif",
  display: "swap",
})
const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-face",
  display: "swap",
})

const App = ({ Component, pageProps }) => {
  const gaTrackingId =
    process.env.NEXT_PUBLIC_GA_TRACKING_ID || process.env.GA_TRACKING_ID || ""

  useEffect(() => {
    applyStoredTheme()
    window.setTheme = setTheme

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const followSystemTheme = () => {
      if (!localStorage.getItem(THEME_KEY)) {
        setTheme(getSystemTheme(), { persist: false })
      }
    }
    mediaQuery.addEventListener("change", followSystemTheme)
    return () => mediaQuery.removeEventListener("change", followSystemTheme)
  }, [])

  return (
    <>
      {gaTrackingId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaTrackingId}', {
                anonymize_ip: true,
                respect_dnt: true
              });
            `}
          </Script>
        </>
      ) : null}
      <div className={`font-root ${serif.variable} ${sans.variable} ${mono.variable}`}>
        <Component {...pageProps} />
      </div>
    </>
  )
}

export default App
