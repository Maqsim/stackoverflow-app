import { Flex } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

type Props = {
  to?: string;
  children: any;
};

export function MenuItem({ children, to }: Props) {
  return (
    <RouterLink to={to}>
      <Flex
        color="rgba(255, 255, 255, .7)"
        borderRadius="5px"
        cursor="pointer"
        alignItems="center"
        fontWeight="semibold"
        _hover={{ color: 'white', bgColor: 'rgba(255, 255, 255, 0.1)' }}
        p="4px 10px"
      >
        {children}
      </Flex>
    </RouterLink>
  );
}
