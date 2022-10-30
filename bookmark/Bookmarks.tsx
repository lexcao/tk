import {
  Button,
  Card,
  DisplayText,
  EmptySearchResult,
  EmptyState,
  Icon,
  KeyboardKey,
  Modal,
  ResourceList,
  Stack,
  Tag,
  TextField,
  TextStyle,
  useEventListener,
} from '@shopify/polaris'
import React, {memo, useCallback, useMemo, useState} from 'react'
import {SearchMinor} from "@shopify/polaris-icons";
import {useField} from "@shopify/react-form";
import {Bookmark} from "./types";
import BookmarkForm from './BookmarkForm';
import {useBookmarks} from "./hooks";

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
    allBookmarks,
    saveBookmark,
    deleteBookmark,
  } = useBookmarks();

  useEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key == '/' && !modalActive) {
      setSearchFocused(!searchFocused);
      e.preventDefault();
      return;
    }

    if (e.ctrlKey && e.key === 'n') {
      handleCreateBookmark();
      e.preventDefault();
      return;
    }
  })

  const [editingBookmark, setEditingBookmark] = useState<Bookmark | undefined>();

  const [searchFocused, setSearchFocused] = useState(false);
  const search = useField('');
  const isFiltered = search.dirty;
  const searchTags = useMemo(() => search.value?.split(' ')?.filter(Boolean), [search.value]);
  const bookmarks = useMemo(() => {
    if (!search.value) {
      return allBookmarks
    }

    // search by tags
    return searchTags.reduce((b, t) =>
        b.filter(hasTag(t)),
      allBookmarks);
  }, [allBookmarks, search.value, searchTags]);

  const filterControlMarkup = (
    <TextField
      helpText={
        "[TODO]: Pro tips: Enter to choose first selected, ESC to cancel input"
      }
      label="Search"
      labelHidden={true}
      placeholder="Search"
      suffix={<KeyboardKey>/</KeyboardKey>}
      type="text"
      autoComplete="true"
      focused={searchFocused}
      role="search"
      prefix={<Icon source={SearchMinor}/>}
      {...search}/>
  );

  const tagMarkup = (tag: string) => !isFiltered
    ? <Tag key={tag}>{tag}</Tag>
    : <Tag key={tag}>{
      searchTags.some(t => tag.startsWith(t))
        ? <TextStyle variation="strong">{tag}</TextStyle>
        : <><TextStyle variation="code">{tag[0]}</TextStyle>{tag.substring(1)}</>
    }</Tag>

  const [modalActive, setModalActive] = useState(false);
  const toggleModal = useCallback(() => setModalActive(!modalActive), [modalActive])

  const handleCreateBookmark = useCallback(() => {
    setEditingBookmark(undefined)
    toggleModal()
  }, [toggleModal])

  const modalActivator = (
    <Button plain onClick={handleCreateBookmark}>Create [Ctrl-n]</Button>
  )

  const onSaveBookmark = useCallback((bookmark: Bookmark) => {
    saveBookmark(bookmark)
    toggleModal()
  }, [saveBookmark, toggleModal])

  const onDeleteBookmark = useCallback((id: Bookmark['id']) => {
    deleteBookmark(id)
  }, [deleteBookmark]);

  const emptyStateMarkup = (
    <EmptyState heading="Create a bookmark to get started"
                action={{
                  content: 'Create bookmark',
                  onAction: handleCreateBookmark
                }}
                image=""/>
  )

  return (
    <Card>
      <Card.Header
        title="Tag based bookmark manager">
        <Modal
          activator={modalActivator}
          onClose={toggleModal}
          title={editingBookmark ? "Edit bookmark" : "Create bookmark"}
          open={modalActive}>
          <Modal.Section>
            <BookmarkForm
              bookmark={editingBookmark}
              uniqTags={uniqTags}
              onSave={onSaveBookmark}/>
          </Modal.Section>
        </Modal>
      </Card.Header>
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
                  onAction: () => onDeleteBookmark(item.id)
                }
              ]}>
              <Stack alignment="center">
                <DisplayText size="small">{shortenURL(item.url)}</DisplayText>
                <Stack>
                  {item.tags.map(tagMarkup)}
                </Stack>
              </Stack>
            </ResourceList.Item>
          )}
          isFiltered={isFiltered}
          filterControl={filterControlMarkup}
          emptySearchState={emptySearchStateMarkup}
          emptyState={emptyStateMarkup}
        />
      </Card.Section>
    </Card>
  )
}

export default memo(Bookmarks)
