import * as React from "react"

import Layout from "../components/Layout"
import SEO from "../components/seo"

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not Found" noindex />
    <h1>404: Not Found</h1>
    <p>The route you requested does not exist.</p>
  </Layout>
)

export default NotFoundPage
