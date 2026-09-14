import React from "react"
import { Head, Html, Main, NextScript } from "next/document"
import { withBasePath } from "../lib/site"

const Document = () => (
  <Html lang="en">
    <Head>
      <link
        rel="icon"
        href={withBasePath("/favicon.svg")}
        type="image/svg+xml"
      />
    </Head>
    <body>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('site-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'sunset');document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t==='dark'?'dark':'light'}catch(e){}})()`,
        }}
      />
      <Main />
      <NextScript />
    </body>
  </Html>
)

export default Document
