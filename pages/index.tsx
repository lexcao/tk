import React from "react";
import {Layout, Page} from "@shopify/polaris";
import Bookmarks from "../bookmark/Bookmarks";

export default function Index() {
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Bookmarks/>
        </Layout.Section>
      </Layout>
    </Page>
  )
}
