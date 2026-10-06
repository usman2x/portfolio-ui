import React from "react"
import Link from "next/link"
import ProjectCard from "./ProjectCard"

// Featured case studies, as the same cards as the Projects archive.
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
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  )
}

export default SelectedProjects
