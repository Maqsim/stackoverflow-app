import { Box, Flex, HStack, Image, Input } from '@chakra-ui/react';
import { useUser } from '../../contexts/use-user';
import { useRef, useState } from 'react';
import { CommentType } from '../../interfaces/CommentType';
import stackoverflow from '../../uitls/stackexchange-api';

type Props = {
  postId: number;
  onComment: (comment: CommentType) => void;
  hideControls?: boolean;
};

let timerId: NodeJS.Timeout;

export function CommentForm({ postId, onComment, hideControls }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputWrapperRef = useRef<HTMLDivElement | null>(null);
  const user = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [input, setInput] = useState('');
  const [showError, setShowError] = useState(false);
  const isInvalid = input.length > 0 && input.length < 15;

  async function handleSubmit(event: any) {
    if (event.key !== 'Enter' || !inputRef.current) {
      return;
    }

    if (isInvalid) {
      setShowError(true);

      if (timerId) {
        clearTimeout(timerId);
        inputWrapperRef.current?.classList.remove('shake-out');
      }

      requestAnimationFrame(() => {
        inputWrapperRef.current?.classList.add('shake-out');
      });

      timerId = setTimeout(() => {
        inputWrapperRef.current?.classList.remove('shake-out');
      }, 500);

      return;
    }

    setIsSubmitting(true);

    const response: any = await stackoverflow.post(`posts/${postId}/comments/add`, {
      body: input,
      filter: '!bFsxHu(AR4ev8W',
      preview: true
    });

    const postedComment = response.items[0];

    // TODO Remove me when preview is false
    postedComment.comment_id = Math.round(Math.random() * 1000000);
    postedComment.score = 0;

    onComment(postedComment);

    // Clear state
    setIsSubmitting(false);
    setShowError(false);
    setInput('');
    inputRef.current.value = '';

    // Restore input focus after disabled state
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }

  function trim(str: string) {
    return str.trim().replace(/\s+/g, ' ');
  }

  return (
    <HStack align="flex-start" fontSize="13px">
      <Flex w={hideControls ? 'auto' : '66px'} flexShrink={0} justify="end">
        <Image src={user.data.profile_image} boxSize="24px" objectFit="cover" borderRadius="3px" />
      </Flex>
      <Box ref={inputWrapperRef} w="100%" position="relative">
        <Input
          ref={inputRef}
          onChange={(event) => setInput(trim(event.target.value))}
          onKeyDown={handleSubmit}
          isDisabled={isSubmitting}
          size="xs"
          placeholder="Your comment..."
        />

        {/* Just counter */}
        {isInvalid && !showError && (
          <Box position="absolute" right="10px" top="4px" fontSize="12px" color="gray.500">
            {input.length - 15}
          </Box>
        )}

        {/* Counter with error message */}
        {isInvalid && showError && (
          <Box position="absolute" right="10px" top="4px" fontSize="12px" color="red.500">
            The comment must have more {15 - input.length} characters
          </Box>
        )}
      </Box>
    </HStack>
  );
}
