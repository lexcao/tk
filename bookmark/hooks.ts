import {useLocalStorage} from "../util/use-local-storage";
import {Bookmark} from "./types";
import {useMemo} from "react";
import {randomID} from "../util/id-generator";

const key = "tk__bookmarks"

export const useBookmarks = () => {
  const [allBookmarks, setAll] = useLocalStorage<Bookmark[]>(key, []);

  const uniqTags = useMemo(() => [...new Set(allBookmarks.flatMap(it => it.tags))], [allBookmarks])

  const saveBookmark = (bookmark: Bookmark) => {
    if (!bookmark.id) {
      setAll(allBookmarks.concat({...bookmark, id: randomID()}))
    } else {
      const index = allBookmarks.findIndex(it => it.id === bookmark.id)
      setAll([
          ...allBookmarks.slice(0, index),
          bookmark,
          ...allBookmarks.slice(index + 1)
        ]
      )
    }
  }

  const deleteBookmark = (id: Bookmark['id']) => {
    console.log("Deleting...", id, allBookmarks)
    const index = allBookmarks.findIndex(it => it.id === id);
    setAll([
      ...allBookmarks.slice(0, index),
      ...allBookmarks.slice(index + 1)
    ])
  }

  return {
    uniqTags,
    allBookmarks,
    saveBookmark,
    deleteBookmark
  }
}
