import { Box, Button, Center, Input, Spinner, Text } from '@chakra-ui/react';
import { TagList } from './TagList';
import { useEffect, useRef, useState } from 'react';
import stackoverflow from '../../unitls/stackexchange-api';
import { TagType } from '../../interfaces/TagType';
import { TagSkeleton } from './Tag.skeleton';
import randomRange from '../../unitls/random-range';

type Props = {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  showSkeletons?: boolean;
};

export function EditableTagList({ tags, onAdd, onRemove, showSkeletons }: Props) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDropdownLoading, setIsDropdownLoading] = useState(false);
  const [input, setInput] = useState('');
  const [formState, setFormState] = useState<'button' | 'input'>('button');
  const [isDropdownShown, setIsDropdownShown] = useState(false);
  const [foundTags, setFoundTags] = useState<TagType[]>([]);
  const skeletonsTagCount = useRef(randomRange(20, 30));

  useEffect(() => {
    if (input.trim().length) {
      setIsDropdownShown(true);
      setIsDropdownLoading(true);

      stackoverflow.get('tags', { inname: input }).then((response: any) => {
        const filteredTags = response.items.filter((t: TagType) => !tags.includes(t.name));

        setFoundTags(filteredTags);
        setIsDropdownLoading(false);
      });
    } else {
      setIsDropdownShown(false);
      setFoundTags([]);
    }
  }, [input]);

  // TODO refactor this shit
  function handleEnter(event: any) {
    if (event.key !== 'Enter' || !input) {
      return;
    }

    onAdd(input);
    setFormState('button');

    requestAnimationFrame(() => {
      buttonRef.current?.focus();
    });
  }

  function handleAddClick() {
    setFormState('input');

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }

  function handleSelectTag(tag: string) {
    onAdd(tag);
    setInput('');
    setFormState('button');

    requestAnimationFrame(() => {
      buttonRef.current?.focus();
    });
  }

  return (
    <Box>
      {showSkeletons && [...Array(skeletonsTagCount.current)].map((_, index) => <TagSkeleton key={index} />)}
      {!showSkeletons && <TagList tags={tags} isRemovable onRemove={onRemove} />}

      {!showSkeletons && formState === 'button' && (
        <Button ref={buttonRef} size="xs" variant="outline" rounded="3px" onClick={handleAddClick}>
          Add tag...
        </Button>
      )}
      {!showSkeletons && formState === 'input' && (
        <Box as="span" position="relative">
          <Input
            ref={inputRef}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleEnter}
            w="auto"
            size="xs"
            placeholder="Enter tag name..."
          />
          <Box
            display={isDropdownShown ? 'block' : 'none'}
            position="absolute"
            overflow="auto"
            top="24px"
            left="0"
            w="100%"
            maxH="200px"
            bgColor="white"
            shadow="base"
            rounded="5px"
            fontSize="13px"
          >
            {isDropdownLoading && (
              <Center py="10px">
                <Spinner size="xs" />
              </Center>
            )}

            {!isDropdownLoading &&
              foundTags.map((tag) => (
                <Box
                  p="2px 10px"
                  _hover={{ bgColor: 'gray.50' }}
                  cursor="pointer"
                  onClick={() => handleSelectTag(tag.name)}
                  key={tag.name}
                >
                  {tag.name}
                </Box>
              ))}

            {!isDropdownLoading && foundTags.length === 0 && (
              <Text textAlign="center" color="gray.500" py="10px">
                No tags found.
              </Text>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
