import React from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import SEO from "../components/seo";
import { fetchSiteSettings, fetchSystemPages } from "../lib/cms";

// Outline button: a quiet way back, with no sales panel after a completed form.
const ThankYouPage = ({ siteSettings, systemPages }) => {
  return (
    <Layout showBookCall={false} siteSettings={siteSettings}>
      <SEO title={systemPages.thankYouTitle} noindex siteSettings={siteSettings} />
      <section className="container page-intro utility-page">
        <h1 className="page-title">{systemPages.thankYouTitle}</h1>
        <p className="page-description">{systemPages.thankYouMessage}</p>
        <div className="page-actions">
          <Link href="/" className="theme-btn-outline">{systemPages.homeButtonLabel}</Link>
        </div>
      </section>
    </Layout>
  );
};

export const getStaticProps = async () => {
  const [siteSettings, systemPages] = await Promise.all([fetchSiteSettings(), fetchSystemPages()]);
  return { props: { siteSettings, systemPages } };
};

export default ThankYouPage;
