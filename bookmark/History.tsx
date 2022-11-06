import {Stack, Tag} from "@shopify/polaris";
import {memo} from "react";
import {Bookmark} from "./types";

interface HistoryProps {
  histories: Bookmark[]
}

const History = ({histories}: HistoryProps) =>
  <Stack>
    {histories.map(it => {
      return (
        <Tag key={it.id} onClick={() => { window.open(it.url) }}>
          {it.tags.join("|")}
        </Tag>
      )
    })}
  </Stack>

export default memo(History)
