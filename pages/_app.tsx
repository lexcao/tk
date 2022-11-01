import '@shopify/polaris/build/esm/styles.css';
import type {AppProps} from 'next/app'
import PolarisProvider from "../components/PolarisProvider";
import React from "react";
import Footer from "../components/Footer";
import {AnalyticsWrapper} from "../components/AnalyticsWrapper";

export default function App({Component, pageProps}: AppProps) {
  return (
    <PolarisProvider>
      <Component {...pageProps} />

      <footer style={{
        padding: "1rem",
        bottom: 0,
        width: "100%",
        position: "absolute"
      }}>
        <Footer/>
      </footer>

      <AnalyticsWrapper/>
    </PolarisProvider>
  )
}
