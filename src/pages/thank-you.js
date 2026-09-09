import React from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import { fetchSiteSettings, fetchSystemPages } from "../lib/cms";

const ThankYouPage = ({ siteSettings, systemPages }) => {
  return (
    <Layout siteSettings={siteSettings}>
      <div className="thank-you-page">
        <h1>{systemPages.thankYouTitle}</h1>
        <p>{systemPages.thankYouMessage}</p>
        <Link href="/" className="theme-btn-primary">{systemPages.homeButtonLabel}</Link>
      </div>
    </Layout>
  );
};

export const getStaticProps = async () => {
  const [siteSettings, systemPages] = await Promise.all([fetchSiteSettings(), fetchSystemPages()]);
  return { props: { siteSettings, systemPages } };
};

export default ThankYouPage;
