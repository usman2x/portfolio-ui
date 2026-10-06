import React from "react"
import Layout from "../components/Layout"
import SEO from "../components/seo"
import TestimonialList from "../components/TestimonialList"
import { fetchPayloadTestimonials, fetchSiteSettings, fetchTestimonialsPage } from "../lib/cms"

const TestimonialsPage = ({ pageContent, siteSettings, testimonials }) => (
  <Layout siteSettings={siteSettings}>
    <SEO
      title={pageContent.seoTitle}
      description={pageContent.seoDescription}
      pathname="/testimonials/"
      siteSettings={siteSettings}
    />
    <div className="container interior-page testimonials-page">
      <header className="page-intro">
        <h1 className="page-title">{pageContent.title}</h1>
        <p className="page-description">{pageContent.description}</p>
      </header>
      <TestimonialList testimonials={testimonials} />
    </div>
  </Layout>
)

export const getStaticProps = async () => {
  const [pageContent, siteSettings, testimonials] = await Promise.all([
    fetchTestimonialsPage(),
    fetchSiteSettings(),
    fetchPayloadTestimonials(),
  ])
  return { props: { pageContent, siteSettings, testimonials } }
}

export default TestimonialsPage
