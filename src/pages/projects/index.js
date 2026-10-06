import React from "react"
import Layout from "../../components/Layout"
import SEO from "../../components/seo"
import ProjectCard from "../../components/ProjectCard"
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
        <header className="page-intro">
          <h1 className="page-title">{archiveSettings.projectsTitle}</h1>
          <p className="page-description">
            {archiveSettings.projectsDescription ||
              "A focused selection of systems and products shaped around real delivery constraints and measurable outcomes."}
          </p>
        </header>

        <div className="home-work-grid">
          {projects.map(project => (
            <ProjectCard key={project.slug} project={project} headingLevel="h2" />
          ))}
        </div>
      </section>
    </Layout>
  )
}

export const getStaticProps = async () => {
  const [projects, archiveSettings, siteSettings] = await Promise.all([
    getAllProjects(),
    fetchArchiveSettings(),
    fetchSiteSettings(),
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
