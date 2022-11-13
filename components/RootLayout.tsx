import React, {PropsWithChildren} from "react";
import {Frame, Stack, Text, TopBar} from "@shopify/polaris";
import TagNavigation from "../bookmark/TagNavigation";
import PolarisProvider from "./PolarisProvider";
import {useBookmarks} from "../bookmark/hooks";
import Footer from "./Footer";
import {useRouter} from "next/router";

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

  const {query, replace} = useRouter();
  const search = query?.t?.toString() || '';

  const searchFieldMarkup = (
    <TopBar.SearchField
      value={search}
      placeholder="Search"
      onChange={value => replace({query: {t: value}})}/>
  )

  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      logoSuffix={logoMarkup}
      searchResultsOverlayVisible
      searchField={searchFieldMarkup}/>
  )

  const {uniqTags} = useBookmarks()
  const navigationMarkup = <TagNavigation uniqTags={uniqTags}/>

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

  return (
    <PolarisProvider>
      <Frame
        logo={logo}
        topBar={topBarMarkup}
        navigation={navigationMarkup}
      >
        {pageMarkup}
      </Frame>
    </PolarisProvider>
  )
}
