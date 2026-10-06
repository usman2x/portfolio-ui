import React from "react"
import Link from "next/link"
import ProjectVisual from "./ProjectVisual"

// The one project list pattern (homepage and archive): media, role, title, summary, outcome.
// The title link stretches over the card, so the whole card is one click target and one tab
// stop. Render inside a `.home-work-grid`.
const ProjectCard = ({ project, headingLevel = "h3" }) => {
  const Heading = headingLevel

  return (
    <article className="home-work-card">
      <div className="home-work-media">
        <ProjectVisual
          image={project.thumbnailImage || project.image}
          alt={project.imageAlt || `${project.title} preview`}
          title={project.title}
          className="home-work-image"
        />
      </div>
      {project.role ? <p className="home-work-role">{project.role}</p> : null}
      <Heading className="home-work-title">
        <Link href={`/projects/${project.slug}/`} className="home-work-link">
          {project.title}
        </Link>
      </Heading>
      <p className="home-work-summary">{project.summary}</p>
      {project.outcome ? (
        <p className="home-work-outcome">
          <strong>Outcome:</strong> {project.outcome}
        </p>
      ) : null}
    </article>
  )
}

export default ProjectCard
