import {useLocalStorage} from "../util/use-local-storage";
import {Bookmark} from "./types";
import {useMemo} from "react";
import {randomID} from "../util/id-generator";

const key = "tk__bookmarks"
const historyKey = "tk__bookmarks-histories"

export const useBookmarks = () => {
  const [allBookmarks, setAll] = useLocalStorage<Bookmark[]>(key, []);

  const uniqTags = useMemo(() => [...new Set(allBookmarks.flatMap(it => it.tags))], [allBookmarks])

  const saveBookmark = (bookmark: Bookmark) => {
    console.log("saveBookmark", bookmark)
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
    console.log("deleteBookmark", id)
    const index = allBookmarks.findIndex(it => it.id === id);
    setAll([
      ...allBookmarks.slice(0, index),
      ...allBookmarks.slice(index + 1)
    ])

    setAllHistories(prev => prev.filter(it => it !== id))
  }

  const [allHistories, setAllHistories] = useLocalStorage<string[]>(historyKey, []);
  const addHistory = (id: string) => {
    setAllHistories(prev => [id, ...prev.filter(it => it !== id)])
  }
  const histories = allHistories
  .slice(0, 5)
  .map(it => allBookmarks.find(b => b.id === it)!);

  return {
    uniqTags,

    histories,
    addHistory,

    allBookmarks,
    saveBookmark,
    deleteBookmark
  }
}
