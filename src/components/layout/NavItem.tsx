import { Badge, HStack } from '@chakra-ui/react';
import { NavLink as RouterLink, useLocation, useMatch, useResolvedPath } from 'react-router-dom';

type Props = {
  to: string;
  count?: number;
  children: any;
};

export function NavItem({ children, count, to }: Props) {
  // const prevPathname = getItem('prev-pathname');
  const location = useLocation();
  // const isNested = countInString('/', location.pathname) > 1;
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: true });
    // || (isNested && to === prevPathname);

  const hoverStyles = {
    color: match ? 'whiteAlpha.900' : 'whiteAlpha.800',
    bgColor: 'whiteAlpha.50'
  };

  return (
    <RouterLink to={to}>
      <HStack
        userSelect={'none'}
        color={match ? 'whiteAlpha.900' : 'whiteAlpha.600'}
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
