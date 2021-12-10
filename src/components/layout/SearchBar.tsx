import { Box, Center, FormControl, Input, Text } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trim } from '../../uitls/trim';

export function SearchBar() {
  const navigate = useNavigate();
  const [isInputVisible, setIsInputVisible] = useState(false);
  // const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  // useEffect(() => {
  //   setIsPopoverVisible(isInputVisible);
  // }, [isInputVisible]);

  function showInput() {
    setIsInputVisible(true);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }

  function hideInput() {
    setIsInputVisible(false);
  }

  // TODO refactor this shit
  function handleEnter(event: any) {
    const isEnter = event.key === 'Enter';
    const isEsc = event.key === 'Escape';
    const sanatizedInput = trim(input);

    if ((!isEnter && !isEsc) || !sanatizedInput) {
      return;
    }

    setIsInputVisible(false);

    if (isEsc) {
      setInput('');

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }

    if (isEnter) {
      if (sanatizedInput !== input) {
        setInput(sanatizedInput);
        if (inputRef.current) {
          inputRef.current.value = sanatizedInput;
        }
      }

      navigate(`/search/${sanatizedInput}`);
    }
  }

  return (
    <Box position="relative" w="350px" sx={{ WebkitAppRegion: 'no-drag' }}>
      <Center
        userSelect="none"
        display={isInputVisible ? 'none' : 'flex'}
        onClick={showInput}
        rounded="5px"
        color="whiteAlpha.600"
        bgColor="whiteAlpha.300"
        transition="all 200ms ease"
        _hover={{ bgColor: 'whiteAlpha.400', color: 'whiteAlpha.800' }}
        w="100%"
        h="25px"
      >
        <Text>{input ? input : 'Search questions and answers'}</Text>
      </Center>

      <FormControl display={isInputVisible ? 'block' : 'none'}>
        <Input
          ref={inputRef}
          onChange={(event) => setInput(event.target.value)}
          onBlur={hideInput}
          onKeyDown={handleEnter}
          bgColor="white"
          rounded="5px"
          size="xs"
          h="25px"
        />
      </FormControl>

      {/*<Box*/}
      {/*  display={isPopoverVisible ? 'block' : 'none'}*/}
      {/*  w="100%"*/}
      {/*  h="200px"*/}
      {/*  position="absolute"*/}
      {/*  top="40px"*/}
      {/*  left={0}*/}
      {/*  bgColor="white"*/}
      {/*  shadow="lg"*/}
      {/*  p="16px"*/}
      {/*  rounded="10px"*/}
      {/*  zIndex={50}*/}
      {/*>*/}
      {/*  <SimpleGrid columns={2}>*/}
      {/*    <Text>[tag] search within a tag</Text>*/}
      {/*    <Text>user:1234 search by author</Text>*/}
      {/*    <Text>"words here" exact phrase</Text>*/}
      {/*    <Text>collective:"Name" collective content</Text>*/}
      {/*    <Text>answers:0 unanswered questions</Text>*/}
      {/*    <Text>score:3 posts with a 3+ score</Text>*/}
      {/*    <Text>is:question type of post</Text>*/}
      {/*    <Text>isaccepted:yes search within status</Text>*/}
      {/*  </SimpleGrid>*/}
      {/*</Box>*/}
    </Box>
  );
}
