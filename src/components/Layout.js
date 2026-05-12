import React from "react";
import Header from "./Header";
import BookCallSection from "./BookCallSection";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <main className="content">{children}</main>
      <BookCallSection />
      <Footer />
    </div>
  );
};

export default Layout;
