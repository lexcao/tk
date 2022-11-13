import '@shopify/polaris/build/esm/styles.css';
import type {AppProps} from 'next/app'
import React from "react";
import RootLayout from "../components/RootLayout";
import Head from "next/head";

export default function App({Component, pageProps}: AppProps) {
  return (
    <RootLayout>
      <Head>
        <title>TK - Tag book marK</title>
        <link rel="icon" href="/favicon.ico"/>
        <meta name="description" content="Tag based bookmark manager"/>
      </Head>
      <Component {...pageProps} />
    </RootLayout>
  )
}
