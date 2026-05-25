import React from "react"
import { withBasePath } from "../lib/site"

const getInitials = (title = "") =>
  title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() || "")
    .join("")

const ProjectVisual = ({ image, alt, title, className }) => {
  const visualClassName = [className, "project-visual"]
    .filter(Boolean)
    .join(" ")

  if (typeof image === "string" && /^https?:\/\//i.test(image)) {
    return (
      <img src={image} alt={alt} className={visualClassName} loading="lazy" />
    )
  }

  if (typeof image === "string" && image) {
    const imageSrc = withBasePath(image.startsWith("/") ? image : `/images/${image}`)
    return (
      <img src={imageSrc} alt={alt} className={visualClassName} loading="lazy" />
    )
  }

  return (
    <div
      className={`${visualClassName} project-visual-fallback`}
      role="img"
      aria-label={alt}
    >
      <span className="project-visual-fallback-mark">{getInitials(title)}</span>
      <span className="project-visual-fallback-title">{title}</span>
    </div>
  )
}

export default ProjectVisual
