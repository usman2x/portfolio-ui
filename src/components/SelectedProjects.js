import React from "react"
import Link from "next/link"
import ProjectVisual from "./ProjectVisual"

// Featured case studies. The title link stretches over the card, so the whole card is one
// click target and one tab stop.
const SelectedProjects = ({ projects, homeContent }) => {
  if (!projects.length) return null

  return (
    <section
      id="projects"
      className="container landing-section home-work"
      aria-labelledby="home-work-title"
    >
      <div className="landing-section-header">
        <h2 id="home-work-title" className="landing-section-title">
          {homeContent.projectsTitle}
        </h2>
        <Link href="/projects/" className="text-link-cta link-underline">
          {homeContent.projectsArchiveLabel}
        </Link>
      </div>
      <div className="home-work-grid">
        {projects.map(project => (
          <article key={project.slug} className="home-work-card">
            <div className="home-work-media">
              <ProjectVisual
                image={project.thumbnailImage || project.image}
                alt={project.imageAlt || `${project.title} preview`}
                title={project.title}
                className="home-work-image"
              />
            </div>
            {project.role ? (
              <p className="home-work-role">{project.role}</p>
            ) : null}
            <h3 className="home-work-title">
              <Link href={`/projects/${project.slug}/`} className="home-work-link">
                {project.title}
              </Link>
            </h3>
            <p className="home-work-summary">{project.summary}</p>
            {project.outcome ? (
              <p className="home-work-outcome">
                <strong>Outcome:</strong> {project.outcome}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}

export default SelectedProjects
