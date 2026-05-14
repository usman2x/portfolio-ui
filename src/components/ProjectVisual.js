import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

const getInitials = (title = "") =>
  title
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() || "")
    .join("")

const ProjectVisual = ({ image, alt, title, className }) => {
  const data = useStaticQuery(graphql`
    query ProjectVisualImagesQuery {
      allFile(filter: { sourceInstanceName: { eq: "images" } }) {
        nodes {
          relativePath
          childImageSharp {
            gatsbyImageData(
              width: 1400
              quality: 86
              placeholder: BLURRED
              formats: [AUTO, WEBP, AVIF]
            )
          }
        }
      }
    }
  `)

  const imageNode = data.allFile.nodes.find(node => node.relativePath === image)
  const projectImage = getImage(imageNode)
  const visualClassName = [className, "project-visual"]
    .filter(Boolean)
    .join(" ")

  if (typeof image === "string" && /^https?:\/\//i.test(image)) {
    return (
      <img src={image} alt={alt} className={visualClassName} loading="lazy" />
    )
  }

  if (projectImage) {
    return (
      <GatsbyImage image={projectImage} alt={alt} className={visualClassName} />
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
