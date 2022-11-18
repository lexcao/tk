import React, {PropsWithChildren} from "react";
import {Frame, Scrollable, Stack, Text, TopBar} from "@shopify/polaris";
import TagNavigation from "../bookmark/TagNavigation";
import PolarisProvider from "./PolarisProvider";
import {useBookmarks} from "../bookmark/hooks";
import TopSearchBar from "./TopSearchBar";
import Footer from "./Footer";

export default function RootLayout({children}: PropsWithChildren) {
  const logo = {
    url: "/",
    width: 36,
    accessibilityLabel: "bookmark manager",
    topBarSource: "https://cdn-icons-png.flaticon.com/512/5249/5249357.png"
  }

  const logoMarkup = (
    <Text variant="headingLg" as="p">TK</Text>
  )

  const topBarMarkup = (
    <TopBar
      logoSuffix={logoMarkup}
      searchField={<TopSearchBar/>}
    />
  )

  const pageMarkup = (
    <Stack vertical>
      <main style={{minHeight: "90vh"}}>
        {children}
      </main>
      <footer style={{padding: "0.6rem"}}>
        <Footer/>
      </footer>
    </Stack>
  )

  const {uniqTags} = useBookmarks()

  return (
    <PolarisProvider>
      <Frame
        logo={logo}
        topBar={topBarMarkup}
        navigation={<TagNavigation uniqTags={uniqTags}/>}
      >
        <Scrollable>
          {pageMarkup}
        </Scrollable>
      </Frame>
    </PolarisProvider>
  )
}
