import localProjects from "../content/misc/projects.json"
import { getCmsContent } from "./cms"
import { getMarkdownPosts } from "./markdown"
import { mergeBlogPosts } from "../utils/blog-posts"
import { mergeProjects } from "../utils/projects"

export const getAllBlogPosts = async () => {
  const [{ blogPosts: cmsPosts }, markdownPosts] = await Promise.all([
    getCmsContent(),
    getMarkdownPosts(),
  ])

  return mergeBlogPosts({ cmsPosts, markdownPosts })
}

export const getAllProjects = async () => {
  const { projects: cmsProjects } = await getCmsContent()
  return mergeProjects({ cmsProjects, localProjects })
}

export const getProjectPagination = (projects, slug) => {
  const index = projects.findIndex(project => project.slug === slug)

  return {
    previousProject:
      index > 0
        ? {
            slug: projects[index - 1].slug,
            title: projects[index - 1].title,
          }
        : null,
    nextProject:
      index >= 0 && index < projects.length - 1
        ? {
            slug: projects[index + 1].slug,
            title: projects[index + 1].title,
          }
        : null,
  }
}
