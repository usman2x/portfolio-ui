import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect } from "react"

const QuoteRedirect = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace("/contact/")
  }, [router])

  return (
    <>
      <Head>
        <title>Contact Me | Muhammad Usman</title>
        <meta name="robots" content="noindex" />
        <link rel="canonical" href="/contact/" />
      </Head>
      <main className="container interior-page redirect-page">
        <p>Taking you to the new contact page…</p>
        <Link href="/contact/" className="theme-btn-primary">
          Continue to Contact Me
        </Link>
      </main>
    </>
  )
}

export default QuoteRedirect
