import React from "react"
import Link from "next/link"
import homeContent from "../content/pages/home.json"
import ProjectVisual from "./ProjectVisual"

const SelectedProjects = ({ projects }) => {
  return (
    <section id="projects" className="container landing-section">
      <div className="landing-section-header">
        <h2 className="landing-section-title">{homeContent.projects.title}</h2>
        <Link href="/projects/" className="text-link-cta link-underline">
          {homeContent.projects.archiveLabel}
        </Link>
      </div>
      <div className="preview-grid projects-preview-grid">
        {projects.map(project => (
          <article
            key={project.slug}
            className="preview-card project-preview-card"
          >
            <Link
              href={`/projects/${project.slug}/`}
              className="project-preview-media-link"
              aria-label={`Open ${project.title} case study`}
            >
              <ProjectVisual
                image={project.image}
                alt={project.imageAlt || `${project.title} project preview`}
                title={project.title}
                className="project-preview-media"
              />
            </Link>
            <div className="preview-card-body">
              <h3 className="preview-card-title">
                <Link
                  href={`/projects/${project.slug}/`}
                  className="project-anchor-link link-underline"
                >
                  {project.title}
                </Link>
              </h3>
              <p className="preview-card-summary">{project.summary}</p>
              <p className="preview-card-role">
                {project.role ? `${project.role} ` : ""}
                <Link
                  href={`/projects/${project.slug}/`}
                  className="text-link-cta link-underline project-inline-more"
                >
                  Read more
                </Link>
              </p>
              <div className="preview-tag-list">
                {(project.tags || []).slice(0, 4).map(tag => (
                  <span key={tag} className="tag-chip">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default SelectedProjects
