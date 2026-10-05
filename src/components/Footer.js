import React from "react"
import Link from "next/link"
import { FileText, Mail } from "lucide-react"
import { iconForSocial } from "../lib/socialIcons"

const Footer = ({ siteSettings }) => {
  const credentialLinks = [
    ...(siteSettings.socialLinks || []).map(item => ({ label: item.name, href: item.url, icon: iconForSocial(item.name) })),
    { label: "Email", href: `mailto:${siteSettings.email}`, icon: Mail },
    { label: "CV", href: siteSettings.resumeLink, icon: FileText },
  ].filter(item => item.href)
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-shell">
          <div className="footer-identity">
            <p className="footer-heading">{siteSettings.name}</p>
            <p className="footer-text">{siteSettings.footerDescription}</p>
            <div className="footer-credential-icons">
              {credentialLinks.map((item) => {
                const Icon = item.icon
                const isExternal = item.href.startsWith("http")
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="footer-credential-icon"
                  >
                    <Icon size={16} strokeWidth={2.1} aria-hidden="true" />
                    <span className="footer-credential-label">{item.label}</span>
                  </a>
                )
              })}
            </div>
          </div>
          <nav className="footer-column footer-nav" aria-label="Footer navigation">
            {(siteSettings.navigation || []).filter(item => !item.isPrimary && !/^https?:/i.test(item.url)).map(item => (
              <Link key={`${item.label}-${item.url}`} href={item.url}>{item.label}</Link>
            ))}
          </nav>
        </div>
        <div className="footer-legal">
          <p>
            © {new Date().getFullYear()} {siteSettings.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
