import React from "react"
import Link from "next/link"

// Quiet back link above a detail page title: muted UI text, underlined on hover only. Not a
// call to action (STYLEGUIDE.md, "Links").
const BackLink = ({ href, children }) => (
  <Link href={href} className="back-link">
    <span aria-hidden="true">←</span> {children}
  </Link>
)

export default BackLink
