import '@shopify/polaris/build/esm/styles.css';
import type {AppProps} from 'next/app'
import PolarisProvider from "../components/PolarisProvider";
import React from "react";
import Footer from "../components/Footer";
import {AnalyticsWrapper} from "../components/AnalyticsWrapper";
import {Stack} from '@shopify/polaris';

export default function App({Component, pageProps}: AppProps) {
  return (
    <PolarisProvider>
      <Stack vertical>
        <main style={{minHeight: "90vh"}}>
          <Component {...pageProps} />
        </main>
        <footer style={{padding: "0.6rem"}}>
          <Footer/>
        </footer>
      </Stack>
      <AnalyticsWrapper/>
    </PolarisProvider>
  )
}
