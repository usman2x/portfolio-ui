import React from "react"
import { Link } from "gatsby"
import { FileText, Github, Linkedin, Mail, MessageCircle } from "lucide-react"
import identity from "../content/misc/identity.json"
import contactData from "../content/misc/contact-data.json"

const credentialLinks = [
  {
    label: "LinkedIn",
    href: contactData.socialLinks.find((link) => link.name === "LinkedIn")?.url,
    icon: Linkedin,
  },
  {
    label: "GitHub",
    href: contactData.socialLinks.find((link) => link.name === "GitHub")?.url,
    icon: Github,
  },
  {
    label: "WhatsApp",
    href: contactData.meetingLink,
    icon: MessageCircle,
  },
  {
    label: "Email",
    href: `mailto:${contactData.email.value}`,
    icon: Mail,
  },
  {
    label: "Resume",
    href: identity.resumeLink,
    icon: FileText,
  },
].filter((item) => item.href)

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-shell">
          <div className="footer-identity">
            <p className="footer-heading">{identity.name}</p>
            <p className="footer-text">
              Software engineer writing and building across full-stack, data,
              and AI systems.
            </p>
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
            <Link to="/about/">About</Link>
            <Link to="/projects/">Projects</Link>
            <Link to="/blog/">Writings</Link>
            <Link to="/quote/">Get a Quote</Link>
          </div>
        </div>
        <div className="footer-legal">
          <p>
            © {new Date().getFullYear()} {identity.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
