import { Box, BoxProps, Flex, FormControl, Input } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import throttle from '../../uitls/throttle';

export function StickyAnswerForm(props: BoxProps) {
  const [translatePosition, setTranslatePosition] = useState<number>(100); // Percents
  let stickyTriggerEl: HTMLElement | null;

  const handleScroll = throttle(() => {
    const windowHeight = window.innerHeight;
    const triggerPosition = stickyTriggerEl?.getBoundingClientRect().bottom;
    const relativePositionInPercent = ((windowHeight - triggerPosition!) / 200) * -100;
    const translatePosition = Math.min(Math.max(relativePositionInPercent, 0), 100);

    setTranslatePosition(translatePosition);
  }, 50);

  useEffect(() => {
    const scrollableEl = document.getElementById('scrolling-container');
    stickyTriggerEl = document.getElementById('question-sticky-trigger');

    scrollableEl?.addEventListener('scroll', handleScroll);

    setTimeout(handleScroll, 50);

    return () => {
      scrollableEl?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // TODO check scroll perf and improve if any
  return (
    <Flex justify="space-between" position="sticky" bottom="-16px" m="-16px" mt="16px" overflow="hidden" zIndex={100}>
      <Box
        bgColor="#fff"
        transition="transform 50ms linear"
        w="100%"
        p="16px"
        style={{
          transform: `translateY(${translatePosition}%)`
        }}
      >
        <FormControl>
          <Input placeholder="Your answer..."/>
        </FormControl>
      </Box>
    </Flex>
  );
}
