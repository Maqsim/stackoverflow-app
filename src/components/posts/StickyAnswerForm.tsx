import { Box, Flex, FormControl, Input } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { throttle } from 'lodash';
import stackoverflow from '../../uitls/stackexchange-api';
import { AnswerType } from "../../interfaces/AnswerType";

type Props = {
  questionId: number;
  onSuccess: (answer: AnswerType) => void;
};

export function StickyAnswerForm({ questionId, onSuccess }: Props) {
  const [translatePosition, setTranslatePosition] = useState<number>(100); // Percents
  const [input, setInput] = useState<string>('');
  let stickyTriggerEl: HTMLElement | null;

  const handleScroll = throttle(
    () => {
      const windowHeight = window.innerHeight;
      const triggerPosition = stickyTriggerEl?.getBoundingClientRect().bottom;
      const relativePositionInPercent = ((windowHeight - triggerPosition!) / 200) * -100;
      const translatePosition = Math.min(Math.max(relativePositionInPercent, 0), 100);

      setTranslatePosition(translatePosition);
    },
    50,
    { leading: true, trailing: true }
  );

  useEffect(() => {
    const scrollableEl = document.getElementById('scrolling-container');
    stickyTriggerEl = document.getElementById('question-sticky-trigger');

    scrollableEl?.addEventListener('scroll', handleScroll);

    setTimeout(handleScroll, 50);

    return () => {
      scrollableEl?.removeEventListener('scroll', handleScroll);
    };
  }, []);

  async function handleSubmit(event: any) {
    if (event.key !== 'Enter') {
      return;
    }

    const response: any = await stackoverflow.post(`questions/${questionId}/answers/add`, {
      body: input,
      filter: '!LJbtD(0QAN35CS5u81eKsH',
      preview: true
    });

    // TODO Remove it when preview = false
    const createdAnswer = response.items[0];
    createdAnswer.answer_id = Math.round(Math.random() * 1000);

    onSuccess(createdAnswer);
  }

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
          <Input placeholder="Your answer…" onChange={(e) => setInput(e.target.value)} onKeyDown={handleSubmit} />
        </FormControl>
      </Box>
    </Flex>
  );
}
