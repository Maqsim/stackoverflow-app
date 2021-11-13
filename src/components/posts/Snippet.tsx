import { Box, Button, HStack, IconButton, Tooltip, useBoolean, useColorModeValue } from '@chakra-ui/react';
import { memo, ReactNode, useEffect, useRef, useState } from 'react';
import { RiFileCopyLine } from 'react-icons/ri';

type Props = {
  children: ReactNode;
};

const NEW_LINE_REG_EXP = /\r\n|\r|\n/;

export const Snippet = memo(({ children }: Props) => {
  const _children = (children as any).props.children;

  if (!_children) {
    return null;
  }

  const lineCount = _children.split(NEW_LINE_REG_EXP).length;
  const shouldZip = lineCount > 20;
  const shouldPreview = lineCount > 40;
  const previewButtonRef = useRef(null);
  const bgColor = useColorModeValue('#f6f6f6', 'gray.700');
  const [isZipped, setIsZipped] = useBoolean(shouldZip);
  const [scrollPosition, setScrollPosition] = useState<number | undefined>();
  const containerRef = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      window.PR.prettyPrint();
    });
  }, []);

  function toggleZip() {
    setIsZipped.toggle();
  }

  function copy() {
    window.Main.copyToClipboard((children as any).props.children);
  }

  useEffect(() => {
    if (!shouldZip) {
      return;
    }

    const scrollableEl = document.getElementById('scrolling-container');

    if (isZipped && typeof scrollPosition === 'number') {
      requestAnimationFrame(() => {
        scrollableEl!.scrollTop = scrollPosition;
        (containerRef.current as unknown as HTMLDivElement).scrollTo(0, 0);
      });
    } else if (!isZipped) {
      setScrollPosition(scrollableEl!.scrollTop);
    }
  }, [isZipped]);

  function openInPreview() {
    window.Main.openCodeInPreview(_children);

    setTimeout(() => {
      // Unfocus the button to hide the tooltip
      (previewButtonRef.current as unknown as HTMLButtonElement).blur();

      // Zip when preview is opened
      if (!isZipped) {
        setIsZipped.on();
      }
    }, 200);
  }

  function shakePreviewButton() {
    if (shouldPreview && isZipped && previewButtonRef && previewButtonRef.current) {
      (previewButtonRef.current as unknown as HTMLButtonElement).classList.add('shake');

      setTimeout(() => {
        (previewButtonRef.current as unknown as HTMLButtonElement).classList.remove('shake');
      }, 820); // Sync with .shake animation duration
    }
  }

  return (
    <Box mb={shouldZip ? '28px' : '16px'} position="relative">
      <Box
        ref={containerRef}
        as="pre"
        className="prettyprint"
        fontSize="13px"
        borderRadius="5px"
        p="10px !important"
        overflow={shouldZip && isZipped ? 'hidden' : 'auto'}
        bgColor={bgColor}
        maxH={shouldZip && isZipped ? '250px' : 'auto'}
        onClick={shouldZip && isZipped ? toggleZip : undefined}
        cursor={shouldZip && isZipped ? 'pointer' : 'auto'}
      >
        {children}
      </Box>

      <HStack position="absolute" top={lineCount <= 2 ? '3px' : '10px'} right="10px">
        {shouldPreview && (
          <Tooltip label="Open in Preview" placement="top">
            <Button
              ref={previewButtonRef}
              boxShadow="base"
              size="sm"
              bgColor="white"
              onClick={openInPreview}
              fontFamily="var(--chakra-fonts-body)"
            >
              Huge file?
            </Button>
          </Tooltip>
        )}

        <IconButton
          aria-label="Copy to clipboard"
          boxShadow="base"
          size="sm"
          onClick={copy}
          bgColor="white"
          icon={<RiFileCopyLine />}
        />
      </HStack>

      {shouldZip && (
        <>
          {isZipped && (
            <Box
              position="absolute"
              pointerEvents="none"
              bottom="0"
              left="0"
              w="100%"
              h="70px"
              bgGradient={`linear(to-t, ${bgColor}, transparent)`}
            />
          )}
          <Button
            boxShadow="base"
            size="xs"
            position="absolute"
            onClick={toggleZip}
            onMouseEnter={shakePreviewButton}
            bottom="0"
            left="50%"
            transform="translate(-50%, 50%)"
            rounded="full"
            bgColor="white"
            fontFamily="var(--chakra-fonts-body)"
          >
            {isZipped ? `Show more ${lineCount - 12} lines` : 'Hide'}
          </Button>
        </>
      )}
    </Box>
  );
});
