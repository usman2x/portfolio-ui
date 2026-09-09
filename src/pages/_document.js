import React from "react"
import { Head, Html, Main, NextScript } from "next/document"
import { withBasePath } from "../lib/site"

const Document = () => (
  <Html lang="en" data-theme="sunset">
    <Head>
      <link rel="icon" href={withBasePath("/favicon.svg")} type="image/svg+xml" />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
)

export default Document
