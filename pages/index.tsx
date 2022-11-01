import React from "react";
import Head from "next/head";
import {Layout, Page} from "@shopify/polaris";
import Bookmarks from "../bookmark/Bookmarks";

export default function Index() {
  return (
    <Page>
      <Head>
        <title>TK - Tag book marK</title>
        <link rel="icon" href="/favicon.ico"/>
        <meta name="description" content="Tag based bookmark manager"/>
      </Head>
      <Layout>
        <Layout.Section>
          <Bookmarks/>
        </Layout.Section>
      </Layout>
    </Page>
  )
}
