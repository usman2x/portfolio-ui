import React from "react"
import Link from "next/link"
import Layout from "../../components/Layout"
import SEO from "../../components/seo"
import ProjectVisual from "../../components/ProjectVisual"
import { getAllProjects } from "../../lib/content"
import { fetchArchiveSettings, fetchSiteSettings } from "../../lib/cms"

const ProjectsPage = ({ projects, archiveSettings, siteSettings }) => {
  return (
    <Layout siteSettings={siteSettings}>
      <SEO
        title={archiveSettings.projectsTitle}
        description={archiveSettings.projectsSeoDescription}
        pathname="/projects/"
        siteSettings={siteSettings}
      />
      <section className="container interior-page">
        <section className="interior-section">
          <h1 className="page-title">{archiveSettings.projectsTitle}</h1>
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
                View case study <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  )
}

export const getStaticProps = async () => {
  const [projects, archiveSettings, siteSettings] = await Promise.all([
    getAllProjects(), fetchArchiveSettings(), fetchSiteSettings(),
  ])

  return {
    props: {
      projects,
      archiveSettings,
      siteSettings,
    },
  }
}

export default ProjectsPage
