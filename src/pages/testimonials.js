import React from "react"
import Layout from "../components/Layout"
import SEO from "../components/seo"
import Testimonials from "../components/Testimonials"
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
      <header className="testimonials-page-intro">
        <p className="section-eyebrow">{pageContent.eyebrow}</p>
        <h1 className="page-title">{pageContent.title}</h1>
        <p className="page-description">{pageContent.description}</p>
      </header>
      <Testimonials
        testimonials={testimonials}
        showHeading={false}
        content={{
          testimonialsEyebrow: pageContent.eyebrow,
          testimonialsTitle: pageContent.title,
          testimonialsDescription: pageContent.description,
        }}
      />
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
