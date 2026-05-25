import React from "react"
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import remarkGfm from "remark-gfm"
import remarkHtml from "remark-html"
import Layout from "../components/Layout"

const ExperiencePage = ({ html, title }) => {
  return (
    <Layout>
      <div className="container mb-6">
        <h1 className="text-center font-heading text-[clamp(1.7rem,2.6vw,2.35rem)] leading-[1.15] text-[var(--text-main)]">
          {title}
        </h1>
      </div>
      <div
        className="article-prose prose prose-lg max-w-[680px] mx-auto"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Layout>
  )
}

export const getStaticProps = async () => {
  const filePath = path.join(process.cwd(), "src/content/experience/all.md")
  const fileContents = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(fileContents)
  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkHtml)
    .process(content)

  return {
    props: {
      html: processedContent.toString(),
      title: data.title || "Experience",
    },
  }
}

export default ExperiencePage
