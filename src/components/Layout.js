import React from "react";
import Header from "./Header";
import BookCallSection from "./BookCallSection";
import Footer from "./Footer";

// Each page ends with one next step: the closing band is the last block of <main> and sits directly
// on the footer (docs/structure/STRUCTURE.md, "Closing band"). Contact, Thank-you and 404 pass
// showBookCall={false}.
const Layout = ({ children, showBookCall = true, siteSettings }) => {
  return (
    <div className="layout">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Header siteSettings={siteSettings} />
      <main id="main-content" className="content" tabIndex="-1">
        {children}
        {showBookCall && <BookCallSection siteSettings={siteSettings} />}
      </main>
      <Footer siteSettings={siteSettings} />
    </div>
  );
};

export default Layout;
