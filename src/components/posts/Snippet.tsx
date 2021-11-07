import { Box, Button, useBoolean, useColorModeValue } from '@chakra-ui/react';
import { memo, ReactNode, useEffect, useRef, useState } from 'react';

type Props = {
  children: ReactNode;
};

export const Snippet = memo(({ children }: Props) => {
  const shouldZip = (children as any).props.children.split(/\r\n|\r|\n/).length > 20;
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

  useEffect(() => {
    if (!shouldZip) {
      return;
    }

    const scrollableEl = document.getElementById('scrolling-container');

    if (isZipped && scrollPosition) {
      requestAnimationFrame(() => {
        console.log(scrollPosition);
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
        maxH={shouldZip && isZipped ? '200px' : 'auto'}
        onClick={shouldZip && isZipped ? toggleZip : undefined}
        cursor={shouldZip && isZipped ? 'pointer' : 'auto'}
      >
        {children}
      </Box>
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
            variant="outline"
            size="xs"
            position="absolute"
            onClick={toggleZip}
            bottom="0"
            left="50%"
            transform="translate(-50%, 50%)"
            rounded="full"
            bgColor="white"
          >
            {isZipped ? 'Show all' : 'Hide'}
          </Button>
        </>
      )}
    </Box>
  );
});
