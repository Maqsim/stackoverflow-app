import { Tag } from './Tag';
import { Box, Button, HStack, SkeletonText, Text } from '@chakra-ui/react';
import { TagType } from '../../interfaces/TagType';
import { useEffect, useState } from 'react';
import stackoverflow from '../../uitls/stackexchange-api';
import { TagWikiType } from '../../interfaces/TagWikiType';
import { FiCheck } from 'react-icons/fi';
import { GoCircleSlash } from 'react-icons/go';
import { TagPreferenceType } from '../../interfaces/TagPreferenceType';
import { useMinDuration } from '../../hooks/use-min-duration';
import parse from 'html-react-parser';
import { useSidebar } from '../../contexts/use-sidebar';

type Props = {
  tag: TagType;
  tagPreferences: TagPreferenceType[];
};

function isInitialWatching(tag: TagType, tagPreferences: TagPreferenceType[]) {
  const foundTagPreference = tagPreferences.find((i) => i.tag_name === tag.name);

  return foundTagPreference && foundTagPreference.tag_preference_type === 'favorite_tag';
}

function isInitialIgnoring(tag: TagType, tagPreferences: TagPreferenceType[]) {
  const foundTagPreference = tagPreferences.find((i) => i.tag_name === tag.name);

  return foundTagPreference && foundTagPreference.tag_preference_type === 'ignored_tag';
}

export function TagTile({ tag, tagPreferences }: Props) {
  const sidebar = useSidebar();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isWatching, setIsWatching] = useState(isInitialWatching(tag, tagPreferences));
  const [isIgnoring, setIsIgnoring] = useState(isInitialIgnoring(tag, tagPreferences));
  const [isWatchInProgress, setIsWatchInProgress] = useState(false);
  const [isIgnoreInProgress, setIsIgnoreInProgress] = useState(false);
  const [tagWiki, setTagWiki] = useState<TagWikiType>();

  const minDuration = useMinDuration(300);

  useEffect(() => {
    stackoverflow.get(`tags/${encodeURIComponent(tag.name)}/wikis`, {}).then((response: any) => {
      setTagWiki(response.items[0]);
      setIsLoaded(true);
    });
  }, []);

  function toggleWatch() {
    setIsWatchInProgress(true);

    // TODO Replace with API
    const foo = new Promise((resolve) => {
      resolve(123);
    });

    minDuration(foo).then((result) => {
      if (sidebar.counts.tags) {
        sidebar.setTagCount(sidebar.counts.tags + (isWatching ? -1 : 1));
      }

      setIsWatching(!isWatching);
      setIsWatchInProgress(false);
    });
  }

  function toggleIgnore() {
    setIsIgnoreInProgress(true);

    // TODO Replace with API
    const foo = new Promise((resolve) => {
      resolve(123);
    });

    minDuration(foo).then((result) => {
      if (sidebar.counts.tags) {
        sidebar.setTagCount(sidebar.counts.tags + (isIgnoring ? -1 : 1));
      }

      setIsIgnoring(!isIgnoring);
      setIsIgnoreInProgress(false);
    });
  }

  return (
    <Box border="1px solid" borderColor={isWatching ? 'green.200' : 'gray.200'} p="8px" rounded="5px" key={tag.name}>
      <Tag bgColor={isWatching ? 'green.300' : undefined} color={isWatching ? 'white' : undefined}>
        {tag.name}
      </Tag>

      {!isLoaded && <SkeletonText noOfLines={3} my="15px" />}
      {isLoaded && tagWiki && (
        <Text noOfLines={3} minH="57px" fontSize="13px" mt="4px" color={isIgnoring ? 'gray.300' : 'black'}>
          {parse(tagWiki.excerpt)}
        </Text>
      )}

      <HStack mt="8px">
        {!isIgnoring && (
          <Button
            bgColor="white"
            size="xs"
            flex={1}
            onClick={toggleWatch}
            isLoading={isWatchInProgress}
            isDisabled={isIgnoreInProgress || isWatchInProgress}
          >
            {isWatching ? (
              <>
                <Text color="green.300" mr="3px" mt="-1px" fontSize="15px">
                  <FiCheck />
                </Text>
                Watching
              </>
            ) : (
              'Watch'
            )}
          </Button>
        )}
        {!isWatching && (
          <Button
            bgColor="white"
            size="xs"
            flex={1}
            onClick={toggleIgnore}
            isLoading={isIgnoreInProgress}
            isDisabled={isIgnoreInProgress || isWatchInProgress}
          >
            {isIgnoring ? (
              <>
                <Text mr="3px" mt="-2px" fontSize="13px">
                  <GoCircleSlash />
                </Text>
                Ignoring
              </>
            ) : (
              'Ignore'
            )}
          </Button>
        )}
      </HStack>
    </Box>
  );
}
