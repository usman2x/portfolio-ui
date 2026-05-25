import React from "react"
import Link from "next/link"
import Layout from "../../components/Layout"
import SEO from "../../components/seo"
import projectDetailContent from "../../content/pages/project-detail.json"
import ProjectVisual from "../../components/ProjectVisual"
import { getAllProjects, getProjectPagination } from "../../lib/content"

const renderSectionBlock = (block, projectTitle) => {
  if (block.type === "text") {
    return (
      <p key={block.content} className="project-story-copy">
        {block.content}
      </p>
    )
  }

  if (block.type === "list") {
    return (
      <ul
        key={block.items.join("|")}
        className="project-arrow-list"
        aria-label={block.label || undefined}
      >
        {block.items.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )
  }

  if (block.type === "image" && block.image) {
    return (
      <figure
        key={`${block.image}-${block.caption || ""}`}
        className="project-story-figure"
      >
        <ProjectVisual
          image={block.image}
          alt={block.alt || `${projectTitle} visual reference`}
          title={projectTitle}
          className="project-story-media"
        />
        {block.caption ? (
          <figcaption className="project-story-caption">
            {block.caption}
          </figcaption>
        ) : null}
      </figure>
    )
  }

  return null
}

const ProjectPage = ({ project, previousProject, nextProject }) => {
  const { navigation, meta, link: linkContent, story } = projectDetailContent
  const projectLinkLabel = project.linkLabel || linkContent.defaultLabel

  return (
    <Layout>
      <SEO
        title={project.seoTitle || `${project.title} | Project Case Study`}
        description={
          project.seoDescription || project.summary || project.description
        }
        pathname={`/projects/${project.slug}/`}
        image={project.ogImageUrl || project.image || ""}
        canonicalUrl={project.canonicalUrl || null}
        noindex={project.noindex}
      />
      <section className="container interior-page project-template-shell">
        <section className="project-case-study-hero">
          <div className="project-case-study-copy">
            <Link
              href="/projects/"
              className="text-link-cta link-underline project-case-study-back"
            >
              {navigation.backLabel}
            </Link>
            <h1 className="project-case-study-title">{project.title}</h1>
            <p className="project-case-study-summary">{project.summary}</p>
          </div>

          <aside className="project-case-study-meta">
            <div className="project-case-study-meta-card">
              <p className="project-case-study-meta-title">{meta.stack}</p>
              <div className="preview-tag-list project-detail-tag-list">
                {(project.tags || []).map(tag => (
                  <span key={tag} className="tag-chip">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {project.link ? (
              <div className="project-case-study-meta-card">
                <p className="project-case-study-meta-title">{meta.link}</p>
                <p className="project-case-study-meta-copy">
                  {linkContent.description}
                </p>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link-cta link-underline project-reference-link"
                >
                  {projectLinkLabel}
                </a>
              </div>
            ) : null}
          </aside>
        </section>

        {project.image ? (
          <figure className="project-story-figure project-story-cover">
            <ProjectVisual
              image={project.image}
              alt={project.imageAlt || `${project.title} project preview`}
              title={project.title}
              className="project-story-media"
            />
          </figure>
        ) : null}

        {project.contentHtml ? (
          <section className="project-story-section">
            <div className="project-story-heading">
              <h2 className="project-story-title">{story.fallbackTitle}</h2>
            </div>
            <div className="project-story-content">
              <div
                className="article-prose"
                dangerouslySetInnerHTML={{ __html: project.contentHtml }}
              />
            </div>
          </section>
        ) : null}

        {(project.sections || []).map((section, index) => (
          <section
            key={`${project.slug}-${section.title}-${index}`}
            className={`project-story-section ${
              section.tone === "soft" ? "project-story-section-soft" : ""
            }`}
          >
            <div className="project-story-heading">
              <h2 className="project-story-title">{section.title}</h2>
            </div>
            <div className="project-story-content">
              {(section.blocks || []).map(block =>
                renderSectionBlock(block, project.title)
              )}
            </div>
          </section>
        ))}

        {(previousProject || nextProject) && (
          <nav className="project-pagination" aria-label="Project pagination">
            {previousProject ? (
              <Link
                href={`/projects/${previousProject.slug}/`}
                className="project-pagination-card"
              >
                <span className="project-pagination-label">
                  Previous project
                </span>
                <strong>{previousProject.title}</strong>
              </Link>
            ) : null}
            {nextProject ? (
              <Link
                href={`/projects/${nextProject.slug}/`}
                className="project-pagination-card project-pagination-card-next"
              >
                <span className="project-pagination-label">Next project</span>
                <strong>{nextProject.title}</strong>
              </Link>
            ) : null}
          </nav>
        )}
      </section>
    </Layout>
  )
}

export const getStaticPaths = async () => {
  const projects = await getAllProjects()

  return {
    paths: projects.map(project => ({ params: { slug: project.slug } })),
    fallback: false,
  }
}

export const getStaticProps = async ({ params }) => {
  const projects = await getAllProjects()
  const project = projects.find(item => item.slug === params.slug) || null

  if (!project) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      project,
      ...getProjectPagination(projects, project.slug),
    },
  }
}

export default ProjectPage
