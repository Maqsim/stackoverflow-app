import { Heading } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { TagPreferenceType } from '../interfaces/TagPreferenceType';
import stackoverflow from '../uitls/stackexchange-api';
import { EditableTagList } from '../components/tags/EditableTagList';
import { useSidebar } from '../contexts/use-sidebar';

export function MyTagsPage() {
  const sidebar = useSidebar();
  const [isLoaded, setIsLoaded] = useState(false);
  const [watchingTags, setWatchingTags] = useState<string[]>([]);
  const [ignoringTags, setIgnoringTags] = useState<string[]>([]);

  useEffect(() => {
    stackoverflow
      .get(`me/tag-preferences`, {})
      .then((response: any) => response.items)
      .then((tagPreferences: TagPreferenceType[]) => {
        const _watchedTags: string[] = [];
        const _ignoredTags: string[] = [];

        tagPreferences.forEach((tagPreference) => {
          switch (tagPreference.tag_preference_type) {
            case 'favorite_tag':
              _watchedTags.push(tagPreference.tag_name);
              break;
            case 'ignored_tag':
              _ignoredTags.push(tagPreference.tag_name);
              break;
          }
        });

        setWatchingTags(_watchedTags);
        setIgnoringTags(_ignoredTags);
        setIsLoaded(true);
      });
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    sidebar.setTagCount(watchingTags.concat(ignoringTags).length);

    stackoverflow.post(`me/tag-preferences/edit`, {
      favorite_tags: watchingTags.join(';'),
      ignored_tags: ignoringTags.join(';')
    });
  }, [watchingTags, ignoringTags]);

  function handleAddWatchedTag(tag: string) {
    const _watchedTags = watchingTags.slice();
    _watchedTags.push(tag);
    setWatchingTags(_watchedTags);

    // Also remove this tag from ignoring list
    if (ignoringTags.includes(tag)) {
      handleRemoveIgnoredTag(tag);
    }
  }

  function handleAddIgnoredTag(tag: string) {
    const _ignoredTags = ignoringTags.slice();
    _ignoredTags.push(tag);
    setIgnoringTags(_ignoredTags);

    // Also remove this tag from watching list
    if (watchingTags.includes(tag)) {
      handleRemoveWatchedTag(tag);
    }
  }

  function handleRemoveWatchedTag(tag: string) {
    const _watchedTags = watchingTags.slice();
    const index = _watchedTags.indexOf(tag);

    _watchedTags.splice(index, 1);

    setWatchingTags(_watchedTags);
  }

  function handleRemoveIgnoredTag(tag: string) {
    const _ignoredTags = ignoringTags.slice();
    const index = _ignoredTags.indexOf(tag);

    _ignoredTags.splice(index, 1);

    setIgnoringTags(_ignoredTags);
  }

  return (
    <>
      <Heading size="lg" mt="16px">
        My tags
      </Heading>

      <Heading size="sm" mt="16px" mb="8px">
        Watching tags
      </Heading>
      <EditableTagList
        tags={watchingTags}
        onRemove={handleRemoveWatchedTag}
        onAdd={handleAddWatchedTag}
        showSkeletons={!isLoaded}
      />

      <Heading size="sm" mt="16px" mb="8px">
        Ignoring tags
      </Heading>
      <EditableTagList
        tags={ignoringTags}
        onRemove={handleRemoveIgnoredTag}
        onAdd={handleAddIgnoredTag}
        showSkeletons={!isLoaded}
      />
    </>
  );
}
