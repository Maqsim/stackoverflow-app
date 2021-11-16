import { Heading, SimpleGrid } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import stackoverflow from '../uitls/stackexchange-api';
import { TagType } from '../interfaces/TagType';
import { TagTile } from '../components/tags/TagTile';
import { TagTileSkeleton } from '../components/tags/TagTile.skeleton';
import { TagPreferenceType } from '../interfaces/TagPreferenceType';

export function TagsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [tags, setTags] = useState<TagType[]>([]);
  const [tagPreferences, setTagPreferences] = useState<TagPreferenceType[]>([]);

  useEffect(() => {
    const getTags = stackoverflow
      .get(`tags`, {
        order: 'desc',
        sort: 'popular'
      })
      .then((response: any) => response.items);

    const getTagPreferences = stackoverflow.get(`me/tag-preferences`, {}).then((response: any) => response.items);

    Promise.all([getTags, getTagPreferences]).then(([tags, tagPreferences]) => {
      setTags(tags);
      setTagPreferences(tagPreferences);
      setIsLoaded(true);
    });
  }, []);

  return (
    <>
      <Heading size="lg" mt="16px">
        All tags
      </Heading>

      <SimpleGrid spacing="16px" mt="16px" columns={3}>
        {/* Skeletons */}
        {!isLoaded && [...Array(30)].map((_, index) => <TagTileSkeleton key={index} />)}

        {isLoaded && tags.map((tag) => <TagTile tag={tag} tagPreferences={tagPreferences} key={tag.name} />)}
      </SimpleGrid>
    </>
  );
}
