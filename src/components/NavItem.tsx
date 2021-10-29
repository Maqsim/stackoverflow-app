import { HStack } from '@chakra-ui/react';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';

type Props = {
  to: string;
  children: any;
};

export function NavItem({ children, to }: Props) {
  const routeMatch = useRouteMatch(to);
  const hoverStyles = {
    color: routeMatch && routeMatch.isExact ? 'whiteAlpha.900' : 'whiteAlpha.800',
    bgColor: 'whiteAlpha.50'
  };

  return (
    <RouterLink to={to}>
      <HStack
        userSelect={'none'}
        color={routeMatch && routeMatch.isExact ? 'whiteAlpha.900' : 'whiteAlpha.600'}
        borderRadius="5px"
        cursor="pointer"
        alignItems="center"
        fontWeight="semibold"
        _hover={hoverStyles}
        p="4px 10px"
        spacing="6px"
      >
        {children}
      </HStack>
    </RouterLink>
  );
}
