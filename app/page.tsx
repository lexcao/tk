"use client";

import {Layout, Page as ShopifyPage} from "@shopify/polaris";
import Bookmarks from "../bookmark/Bookmarks";

export default function Page() {
  return (
    <ShopifyPage>
      <Layout>
        <Layout.Section>
          <Bookmarks/>
        </Layout.Section>
      </Layout>
    </ShopifyPage>
  )
}
