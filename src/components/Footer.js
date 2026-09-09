import React from "react"
import Link from "next/link"
import { Calendar, FileText, Github, Linkedin, Mail } from "lucide-react"
const iconFor = name => ({ GitHub: Github, LinkedIn: Linkedin }[name] || FileText)

const Footer = ({ siteSettings }) => {
  const credentialLinks = [
    ...(siteSettings.socialLinks || []).map(item => ({ label: item.name, href: item.url, icon: iconFor(item.name) })),
    { label: "Book a Call", href: siteSettings.meetingLink, icon: Calendar },
    { label: "Email", href: `mailto:${siteSettings.email}`, icon: Mail },
    { label: "Resume", href: siteSettings.resumeLink, icon: FileText },
  ].filter(item => item.href)
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-shell">
          <div className="footer-identity">
            <p className="footer-heading">{siteSettings.name}</p>
            <p className="footer-text">{siteSettings.footerDescription}</p>
            <div className="footer-credential-icons" aria-label="Credentials">
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
                    aria-label={item.label}
                    title={item.label}
                  >
                    <Icon size={16} strokeWidth={2.1} aria-hidden="true" />
                  </a>
                )
              })}
            </div>
          </div>
          <div className="footer-column">
            <p className="footer-heading">Navigate</p>
            {(siteSettings.navigation || []).filter(item => !item.isPrimary && !/^https?:/i.test(item.url)).map(item => (
              <Link key={`${item.label}-${item.url}`} href={item.url}>{item.label}</Link>
            ))}
          </div>
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
