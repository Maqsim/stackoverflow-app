import { Box, useColorModeValue } from "@chakra-ui/react";
import { ReactNode, useEffect } from 'react';

type Props = {
  children: ReactNode;
};

export function Code({ children }: Props) {
  const bgColor = useColorModeValue('#f6f6f6', 'gray.700');

  useEffect(() => {
    requestAnimationFrame(() => {
      window.PR.prettyPrint();
    });
  }, []);

  return (
    <Box
      as="pre"
      className="prettyprint"
      fontSize="13px"
      borderRadius="5px"
      mb="16px"
      p="10px !important"
      overflowY="auto"
      bgColor={bgColor}
    >
      {children}
    </Box>
  );
}
