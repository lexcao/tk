import {memo, useCallback, useEffect, useMemo} from "react";
import {Button, Combobox, Form, FormLayout, Listbox, Stack, Tag, TextField, TextStyle} from "@shopify/polaris";
import {Bookmark} from "./types";
import {lengthLessThan, notEmpty, notEmptyString, useField, useForm} from "@shopify/react-form";
import {Field} from "@shopify/react-form/build/ts/types";
import {PlusMinor} from "@shopify/polaris-icons";

interface TagsAutocompleteProps {
  uniqTags: string[],
  tags: Field<string[]>
  tagInput: Field<string>,
}

const TagsAutocomplete = ({uniqTags, tags, tagInput}: TagsAutocompleteProps) => {
  const [selectedOptions = [], setSelectedOptions] = [tags.value, tags.onChange];
  const [inputValue = '', setInputValue] = [tagInput.value, tagInput.onChange];

  const options = useMemo(() => {
    const allOptions = [...new Set([...uniqTags, ...selectedOptions])];
    const filterRegex = new RegExp(inputValue, 'i');

    if (inputValue) {
      return allOptions.filter(o => o.match(filterRegex))
    } else {
      return allOptions
    }
  }, [inputValue, selectedOptions, uniqTags])

  const updateSelection = useCallback((selected: string) => {
      const nextSelectedOptions = new Set([...selectedOptions]);

      if (nextSelectedOptions.has(selected)) {
        nextSelectedOptions.delete(selected);
      } else {
        nextSelectedOptions.add(selected);
      }

      setSelectedOptions([...nextSelectedOptions]);
      setInputValue('');
    },
    [selectedOptions, setInputValue, setSelectedOptions]
  );

  const removeTag = useCallback(
    (tag: string) => () => {
      updateSelection(tag)
    },
    [updateSelection],
  );

  const verticalContentMarkup =
    selectedOptions.length > 0 ? (
      <Stack spacing="extraTight" alignment="center">
        {selectedOptions.map((option) => {
          return (
            <Tag key={`option-${option}`} onRemove={removeTag(option)}>
              {option}
            </Tag>
          );
        })}
      </Stack>
    ) : null;

  const formatOptionText = useCallback(
    (option: string) => {
      const trimValue = inputValue.trim().toLocaleLowerCase();
      const matchIndex = option.toLocaleLowerCase().indexOf(trimValue);

      if (!inputValue || matchIndex === -1) return option;

      const start = option.slice(0, matchIndex);
      const highlight = option.slice(matchIndex, matchIndex + trimValue.length);
      const end = option.slice(matchIndex + trimValue.length, option.length);

      return (
        <p>
          {start}
          <TextStyle variation="strong">{highlight}</TextStyle>
          {end}
        </p>
      );
    },
    [inputValue],
  );

  const optionMarkup = options.map(o => (
    <Listbox.Option
      key={o}
      value={o}
      selected={selectedOptions.includes(o)}
      accessibilityLabel={o}>
      <Listbox.TextOption selected={selectedOptions.includes(o)}>
        {formatOptionText(o)}
      </Listbox.TextOption>
    </Listbox.Option>
  ));

  const actionMarkup = options.length === 0 && !!inputValue ? (
    <Listbox.Action icon={PlusMinor} value={inputValue}>
      {inputValue}
    </Listbox.Action>
  ) : null;

  return (
    <Combobox
      activator={(
        <Combobox.TextField
          requiredIndicator
          autoComplete="false"
          onChange={setInputValue}
          label="Tags"
          error={tags.error || tagInput.error}
          value={inputValue}
          placeholder="Type or select"
          verticalContent={verticalContentMarkup}
        />)}
      allowMultiple
    >
      <Listbox onSelect={updateSelection}>
        {actionMarkup}
        {optionMarkup}
      </Listbox>
    </Combobox>
  );
}

interface BookmarkFormProps {
  uniqTags: string[]
  bookmark?: Bookmark,
  onSave: (bookmark: Bookmark) => void
}

const BookmarkForm = ({
  bookmark = {id: '', url: '', tags: []},
  uniqTags,
  onSave,
}: BookmarkFormProps) => {
  const {
    fields: {url, tags},
    dirty,
    reset,
    submit,
  } = useForm({
    fields: {
      url: useField({
        value: bookmark?.url,
        validates: [
          notEmptyString("url is required"),
          (value) => {
            const urlString = value.trim();
            try { new URL(urlString) } catch (e) {return "invalid url"}
            return undefined
          }
        ]
      }),
      tags: useField({
        value: bookmark?.tags,
        validates: [
          notEmpty("tags is empty")
        ]
      }),
    },
    onSubmit: async (fieldValues) => {
      onSave({id: bookmark?.id, ...fieldValues});
      reset();
      tagInput.reset();
      return {status: 'success'}
    }
  })

  const tagInput = useField({
    value: '',
    validates: [
      lengthLessThan(128, "tag should be less than 128"),
      (value) => {
        const regex = /^[a-zA-Z0-9]+$/;
        return value.match(regex) ? undefined
          : "tag should be [a-z0-9]"
      }
    ]
  });

  useEffect(() => {
    if (!url.defaultValue && !!bookmark?.url) {
      url.newDefaultValue(bookmark.url)
    }
    if (!!tags.defaultValue && !bookmark?.tags) {
      tags.newDefaultValue(bookmark.tags)
    }
  }, [bookmark.tags, bookmark.url, tags, url])

  return (
    <Form onSubmit={submit}>
      <FormLayout>

        <TextField
          autoFocus
          label="URL"
          requiredIndicator
          inputMode="url"
          autoComplete="false"
          {...url}/>

        <TagsAutocomplete
          uniqTags={uniqTags}
          tagInput={tagInput}
          tags={tags}/>

        <Button disabled={!dirty} primary submit>Save</Button>
      </FormLayout>
    </Form>
  )
}

export default memo(BookmarkForm)
