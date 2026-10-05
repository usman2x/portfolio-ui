import * as React from "react"
import Link from "next/link"

import Layout from "../components/Layout"
import SEO from "../components/seo"
import { fetchSiteSettings, fetchSystemPages } from "../lib/cms"

const NotFoundPage = ({ siteSettings, systemPages }) => (
  <Layout siteSettings={siteSettings}>
    <SEO title={systemPages.notFoundTitle} noindex siteSettings={siteSettings} />
    <section className="container page-intro utility-page">
      <h1 className="page-title">{systemPages.notFoundTitle}</h1>
      <p className="page-description">{systemPages.notFoundMessage}</p>
      <div className="page-actions">
        <Link href="/" className="theme-btn-outline">{systemPages.homeButtonLabel}</Link>
      </div>
    </section>
  </Layout>
)

export const getStaticProps = async () => {
  const [siteSettings, systemPages] = await Promise.all([fetchSiteSettings(), fetchSystemPages()])
  return { props: { siteSettings, systemPages } }
}

export default NotFoundPage
