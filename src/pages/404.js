import * as React from "react"

import Layout from "../components/Layout"
import SEO from "../components/seo"
import { fetchSiteSettings, fetchSystemPages } from "../lib/cms"

const NotFoundPage = ({ siteSettings, systemPages }) => (
  <Layout siteSettings={siteSettings}>
    <SEO title={systemPages.notFoundTitle} noindex siteSettings={siteSettings} />
    <h1>{systemPages.notFoundTitle}</h1>
    <p>{systemPages.notFoundMessage}</p>
  </Layout>
)

export const getStaticProps = async () => {
  const [siteSettings, systemPages] = await Promise.all([fetchSiteSettings(), fetchSystemPages()])
  return { props: { siteSettings, systemPages } }
}

export default NotFoundPage
