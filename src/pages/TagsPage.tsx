import { Box, Heading, SimpleGrid } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import stackoverflow from '../uitls/stackexchange-api';
import { TagType } from '../interfaces/TagType';
import { TagTile } from '../components/tags/TagTile';
import { TagTileSkeleton } from '../components/tags/TagTile.skeleton';
import { TagPreferenceType } from '../interfaces/TagPreferenceType';
import { usePagination } from '../hooks/use-pagination';
import { Pagination } from '../components/ui/Pagination';

export function TagsPage() {
  const pagination = usePagination();
  const [isLoaded, setIsLoaded] = useState(false);
  const [tags, setTags] = useState<TagType[]>([]);
  const [tagPreferences, setTagPreferences] = useState<TagPreferenceType[]>([]);

  useEffect(() => {
    const getTags = stackoverflow.get(`tags`, {
      order: 'desc',
      page: pagination.page,
      perpage: pagination.perPage,
      filter: '!nKzQUR693x',
      sort: 'popular'
    });

    const getTagPreferences = stackoverflow.get(`me/tag-preferences`, {}).then((response: any) => response.items);

    Promise.all([getTags, getTagPreferences]).then(([tagsResponse, tagPreferences]) => {
      pagination.setTotal((tagsResponse as any).total);
      setTags((tagsResponse as any).items);
      setTagPreferences(tagPreferences);
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    fetchPage();
  }, [pagination.page, pagination.perPage]);

  async function fetchPage() {
    setIsLoaded(false);

    const response = await stackoverflow.get(`tags`, {
      order: 'desc',
      page: pagination.page,
      perpage: pagination.perPage,
      filter: '!nKzQUR693x',
      sort: 'popular'
    });

    setTags((response as any).items);
    setIsLoaded(true);
  }

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

      {isLoaded && (
        <Box my="16px">
          <Pagination controller={pagination} />
        </Box>
      )}
    </>
  );
}
