import {
  Card,
  EmptySearchResult,
  EmptyState,
  KeyboardKey,
  Modal,
  ResourceList,
  Stack,
  Tag,
  Text,
} from '@shopify/polaris'
import React, {memo, useCallback, useMemo, useState} from 'react'
import {Bookmark} from "./types";
import BookmarkForm from './BookmarkForm';
import History from './History';
import {useBookmarks} from "./hooks";
import {useRouter} from "next/router";
import {toArray} from "../util/to-array";

const emptySearchStateMarkup = (
  <EmptySearchResult
    title="No search results"
    description="Create a new or change the search"
    withIllustration={true}
  />
)

const shortenURL = (urlString: string) => {
  try {
    const url = new URL(urlString);
    return url.hostname || urlString;
  } catch (e) {
    return urlString;
  }
}

const matchTag = (tag: string) => {
  return (t: string) => t.startsWith(tag)
}

const hasTag = (tag: string) => {
  return (bookmark: Bookmark) => bookmark.tags.some(matchTag(tag))
}

const Bookmarks = () => {
  const {
    uniqTags,

    histories,
    addHistory,

    allBookmarks,
    saveBookmark,
    deleteBookmark,
  } = useBookmarks();

  const {query} = useRouter();
  const queryTags: string[] = toArray(query.t)
  console.log(queryTags)

  const [editingBookmark, setEditingBookmark] = useState<Bookmark | undefined>();

  const isFiltered = !!query.t;

  const searchTags = useMemo(() => [
    ...queryTags,
  ], [queryTags]);

  const bookmarks = useMemo(() => {
    if (searchTags.length === 0) {
      return allBookmarks
    }

    return searchTags.reduce((b, t) =>
        b.filter(hasTag(t)),
      allBookmarks);
  }, [allBookmarks, searchTags]);

  const tagMarkup = (tag: string) => !isFiltered
    ? <Tag key={tag}>{tag}</Tag>
    : <Tag key={tag}>{
      searchTags.some(t => tag.startsWith(t))
        ? <Text fontWeight="bold" variant="bodyLg" as="span">{tag}</Text>
        : <Text variant="bodyMd" as="span">
          <KeyboardKey>{tag[0]}</KeyboardKey>
          {tag.substring(1)}
        </Text>
    }</Tag>

  const [modalActive, setModalActive] = useState(false);
  const toggleModal = useCallback(() => setModalActive(!modalActive), [modalActive])

  const handleCreateBookmark = useCallback(() => {
    setEditingBookmark(undefined)
    toggleModal()
  }, [toggleModal])

  const onSaveBookmark = useCallback((bookmark: Bookmark) => {
    saveBookmark(bookmark)
    setModalActive(false)
  }, [saveBookmark, setModalActive])

  const emptyStateMarkup = (
    <EmptyState heading="Create a bookmark to get started"
                action={{
                  content: 'Create bookmark',
                  onAction: handleCreateBookmark
                }}
                image=""/>
  )

  return (
    <Card actions={[{content: "Create", onAction: toggleModal}]}>
      <Modal
        onClose={toggleModal}
        title={!!editingBookmark ? "Edit bookmark" : "Create bookmark"}
        open={modalActive}>
        <Modal.Section>
          <BookmarkForm
            bookmark={editingBookmark}
            uniqTags={uniqTags}
            onSave={onSaveBookmark}/>
        </Modal.Section>
      </Modal>
      <Card.Section title="Histories">
        <History histories={histories}/>
      </Card.Section>
      <Card.Section>
        <ResourceList
          resourceName={{
            plural: "bookmarks",
            singular: "bookmark",
          }}
          items={bookmarks}
          renderItem={(item) => (
            <ResourceList.Item
              id={item.id}
              url={item.url}
              onClick={() => addHistory(item.id)}
              external
              persistActions
              shortcutActions={[
                {
                  content: "edit",
                  onAction() {
                    setEditingBookmark(item);
                    toggleModal();
                  }
                },
                {
                  content: "delete",
                  onAction() {
                    deleteBookmark(item.id)
                  }
                }
              ]}>
              <Stack alignment="center">
                <Text variant="headingSm" as="h2">{shortenURL(item.url)}</Text>
                <Stack>
                  {item.tags.map(tagMarkup)}
                </Stack>
              </Stack>
            </ResourceList.Item>
          )}
          isFiltered={isFiltered}
          emptySearchState={emptySearchStateMarkup}
          emptyState={emptyStateMarkup}
        />
      </Card.Section>
    </Card>
  )
}

export default memo(Bookmarks)
