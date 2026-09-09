import { getCmsContent } from "./cms"

let cmsContentPromise

const loadCmsContent = () => {
  if (!cmsContentPromise) {
    cmsContentPromise = getCmsContent()
  }

  return cmsContentPromise
}

export const getAllBlogPosts = async () => {
  const { blogPosts } = await loadCmsContent()
  return blogPosts
}

export const getAllProjects = async () => {
  const { projects } = await loadCmsContent()
  return projects.map((project, sortIndex) => ({
    ...project,
    sortIndex,
    summary: project.excerpt || project.description || "",
    description: project.description || project.excerpt || "",
    role: project.projectRole || "",
    image: project.coverImageUrl || null,
    imageAlt: project.coverImageAlt || project.title || "",
    tags: (project.tags || []).filter(
      tag => String(tag).trim().toLowerCase() !== "case study"
    ),
    link: null,
    linkLabel: null,
    sections: [],
  }))
}

export const getProjectPagination = (projects, slug) => {
  const index = projects.findIndex(project => project.slug === slug)

  return {
    previousProject:
      index > 0
        ? {
            slug: projects[index - 1].slug,
            title: projects[index - 1].title,
            description: projects[index - 1].summary,
          }
        : null,
    nextProject:
      index >= 0 && index < projects.length - 1
        ? {
            slug: projects[index + 1].slug,
            title: projects[index + 1].title,
            description: projects[index + 1].summary,
          }
        : null,
  }
}
