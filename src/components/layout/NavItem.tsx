import { Badge, HStack } from '@chakra-ui/react';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';

type Props = {
  to: string;
  count?: number;
  children: any;
};

export function NavItem({ children, count, to }: Props) {
  const location = useLocation();

  let isMatch;

  if (location.pathname === to && location.pathname === '/') {
    isMatch = true;
  } else if (to !== '/') {
    isMatch = new RegExp('^' + to).test(location.pathname);
  }

  const hoverStyles = {
    color: isMatch ? 'whiteAlpha.900' : 'whiteAlpha.800',
    bgColor: 'whiteAlpha.50'
  };

  return (
    <RouterLink to={to}>
      <HStack
        userSelect={'none'}
        color={isMatch ? 'whiteAlpha.900' : 'whiteAlpha.600'}
        borderRadius="5px"
        cursor="pointer"
        alignItems="center"
        fontWeight="semibold"
        _hover={hoverStyles}
        p="4px 10px"
        spacing="6px"
      >
        {children}
        <Badge display="block" transition="opacity 200ms ease" opacity={count ? 1 : 0} marginLeft="auto !important">
          {count}
        </Badge>
      </HStack>
    </RouterLink>
  );
}
