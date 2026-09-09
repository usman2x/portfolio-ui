import React from "react";
import Header from "./Header";
import BookCallSection from "./BookCallSection";
import Footer from "./Footer";

const Layout = ({ children, showBookCall = true, siteSettings }) => {
  return (
    <div className="layout">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Header siteSettings={siteSettings} />
      <main id="main-content" className="content" tabIndex="-1">{children}</main>
      {showBookCall && <BookCallSection siteSettings={siteSettings} />}
      <Footer siteSettings={siteSettings} />
    </div>
  );
};

export default Layout;
