import {memo} from "react";
import {Navigation} from "@shopify/polaris";
import {ItemProps} from "@shopify/polaris/build/ts/latest/src/components/Navigation/components/Item";
import {HideMinor, ViewMinor} from "@shopify/polaris-icons";
import {useRouter} from "next/router";
import {toArray} from "../util/to-array";

interface TagNavigationProps {
  uniqTags: string[]
}

const TagNavigation = ({uniqTags}: TagNavigationProps) => {
  const {query, replace} = useRouter()
  const queryTags: string[] = toArray(query.t)

  const items: ItemProps[] = uniqTags.map(t => {
    let selected = queryTags.includes(t);
    return ({
      label: t,
      selected: selected,
      icon: selected ? ViewMinor : undefined,
      onClick: () => replace({
        query: {t: queryTags.includes(t) ? queryTags.filter(it => it !== t) : [t, ...queryTags]}
      })
    });
  })

  const viewAllTagAction = {
    accessibilityLabel: "view all tags",
    icon: queryTags.length !== 0 ? HideMinor : ViewMinor,
    onClick: () => replace({query: {}}),
    tooltip: {
      content: "view all tags"
    }
  };

  return (
    <Navigation location="/">
      <Navigation.Section title="Tags" items={items} action={viewAllTagAction}/>
    </Navigation>
  )
}

export default memo(TagNavigation)
