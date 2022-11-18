import {memo, useEffect} from "react";
import {useRouter} from "next/router";
import {useField} from "@shopify/react-form";
import {TopBar} from "@shopify/polaris";

const TopSearchBar = () => {
  const {replace} = useRouter();
  const search = useField("");

  useEffect(() => {
    replace({query: {t: search.value}})
  }, [search.value]);

  return (
    <TopBar.SearchField placeholder="Search" {...search}/>
  )
}

export default memo(TopSearchBar)
