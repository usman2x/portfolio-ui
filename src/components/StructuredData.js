import React from "react"
import Head from "next/head"

// Renders one JSON-LD block. "<" is escaped so CMS text can never close the script element.
const StructuredData = ({ data, id = "structured-data" }) => (
  <Head>
    <script
      key={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  </Head>
)

export default StructuredData
