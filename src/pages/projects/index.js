import React from "react"
import Link from "next/link"
import Layout from "../../components/Layout"
import SEO from "../../components/seo"
import projectPage from "../../content/pages/projects.json"
import ProjectVisual from "../../components/ProjectVisual"
import { getAllProjects } from "../../lib/content"

const ProjectsPage = ({ projects }) => {
  return (
    <Layout>
      <SEO
        title={projectPage.seo.title}
        description={projectPage.seo.description}
        pathname="/projects/"
      />
      <section className="container interior-page">
        <section className="interior-section">
          <h1 className="page-title">{projectPage.intro.title}</h1>
        </section>

        <div className="projects-archive-grid">
          {projects.map(project => (
            <article key={project.slug} className="projects-archive-card">
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
              <div className="projects-archive-body">
                <h2 className="interior-section-title">
                  <Link
                    href={`/projects/${project.slug}/`}
                    className="project-anchor-link link-underline"
                  >
                    {project.title}
                  </Link>
                </h2>
                <p className="project-detail-summary">{project.summary}</p>
                {project.role ? (
                  <p className="project-detail-role">{project.role}</p>
                ) : null}
                <div className="preview-tag-list">
                  {(project.tags || []).map(tag => (
                    <span key={tag} className="tag-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <Link
                href={`/projects/${project.slug}/`}
                className="text-link-cta project-preview-more"
                aria-label={`Open ${project.title} case study`}
              >
                <span aria-hidden="true">...</span>
                <span className="sr-only">Open project</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  )
}

export const getStaticProps = async () => {
  const projects = await getAllProjects()

  return {
    props: {
      projects,
    },
  }
}

export default ProjectsPage
