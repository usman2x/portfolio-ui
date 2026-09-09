import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"

const Header = ({ siteSettings }) => {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigationRef = useRef(null)
  const toggleRef = useRef(null)

  useEffect(() => {
    if (!isMenuOpen) return undefined

    const handleKeyDown = event => {
      if (event.key === "Escape") {
        setIsMenuOpen(false)
        toggleRef.current?.focus()
      }
    }
    const handlePointerDown = event => {
      if (!navigationRef.current?.contains(event.target)) setIsMenuOpen(false)
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("pointerdown", handlePointerDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("pointerdown", handlePointerDown)
    }
  }, [isMenuOpen])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const getNavClassName = path => {
    const normalizedPath = path.replace(/\/$/, "")
    const isActive =
      router.pathname === normalizedPath ||
      router.pathname.startsWith(`${normalizedPath}/`)

    return [
      "site-nav-link !text-[var(--text-main)] hover:!text-[var(--brand-primary)] focus:!text-[var(--brand-primary)]",
      isActive ? "site-nav-link-active" : "",
    ]
      .filter(Boolean)
      .join(" ")
  }

  return (
    <header className="header">
      <div className="container header-shell">
        <Link href="/" className="logo-link" onClick={closeMenu}>
          <span className="logo">{siteSettings.name}</span>
          <span className="logo-meta">{siteSettings.shortLabel}</span>
        </Link>
        <nav className="site-nav" ref={navigationRef} aria-label="Primary navigation">
          <button
            ref={toggleRef}
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="primary-navigation"
          >
            <span className="menu-toggle-icon" aria-hidden="true">
              {isMenuOpen ? "×" : "☰"}
            </span>
          </button>
          <ul
            id="primary-navigation"
            className={`nav-links ${isMenuOpen ? "active" : ""}`}
          >
            {(siteSettings.navigation || []).map(item => {
              const itemUrl = item.isPrimary && siteSettings.meetingLink
                ? siteSettings.meetingLink
                : item.url
              const external = /^https?:/i.test(itemUrl)
              const className = item.isPrimary
                ? "theme-btn-primary theme-btn-sm header-nav-cta"
                : getNavClassName(item.url)
              const content = external ? (
                <a className={className} href={itemUrl} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>{item.label}</a>
              ) : (
                <Link className={className} href={itemUrl} onClick={closeMenu}>{item.label}</Link>
              )
              return <li key={`${item.label}-${itemUrl}`} className={item.isPrimary ? "nav-cta-item" : undefined}>{content}</li>
            })}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
