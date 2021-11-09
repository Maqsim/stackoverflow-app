import { Box, Button, IconButton, useBoolean, useColorModeValue } from '@chakra-ui/react';
import { memo, ReactNode, useEffect, useRef, useState } from 'react';
import { RiFileCopyLine } from 'react-icons/ri';

type Props = {
  children: ReactNode;
};

const NEW_LINE_REG_EXP = /\r\n|\r|\n/;

export const Snippet = memo(({ children }: Props) => {
  const lineCount = (children as any).props.children.split(NEW_LINE_REG_EXP).length;
  const shouldZip = lineCount > 20;
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

      <IconButton
        aria-label="Copy to clipboard"
        boxShadow="base"
        size="sm"
        position="absolute"
        onClick={copy}
        top={lineCount <= 2 ? '3px' : '10px'}
        right="10px"
        bgColor="white"
        icon={<RiFileCopyLine />}
      />

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
            bottom="0"
            left="50%"
            transform="translate(-50%, 50%)"
            rounded="full"
            bgColor="white"
            fontFamily="var(--chakra-fonts-body)"
          >
            {isZipped ? 'Show all' : 'Hide'}
          </Button>
        </>
      )}
    </Box>
  );
});
