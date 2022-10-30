"use client";

import React from "react";
import {AppProvider} from "@shopify/polaris";
import '@shopify/polaris/build/esm/styles.css';
import {LinkLikeComponentProps} from "@shopify/polaris/build/ts/latest/src/utilities/link";
import Link from "next/link";
import Footer from "./Footer";
import {AnalyticsWrapper} from "./AnalyticsWrapper";

// TODO prefetch URL?
function NextLink({url, children, external, ...rest}: LinkLikeComponentProps) {
  if (external) {
    rest.target = "_blank";
    rest.rel = "noopener noreferrer";
    return (
      <a href={url} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link prefetch href={url}>
      {children}
    </Link>
  )
}

export default function RootLayout({children}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
    <head>
      <title>TK - Tag book marK</title>
      <link rel="icon" href="/favicon.ico"/>
      <meta name="description" content="Tag based bookmark manager"/>
    </head>
    <body>
    <AppProvider i18n={{}} linkComponent={NextLink}>
      {children}
      <footer style={{
        padding: "1rem",
        bottom: 0,
        width: "100%",
        position: "absolute"
      }}>
        <Footer/>
      </footer>
    </AppProvider>
    <AnalyticsWrapper/>
    </body>
    </html>
  );
}
