import { Badge, HStack } from '@chakra-ui/react';
import { NavLink as RouterLink } from 'react-router-dom';

type Props = {
  to: string;
  count?: number;
  children: any;
};

export function NavItem({ children, count, to }: Props) {
  // const routeMatch = useRouteMatch(to);
  const hoverStyles = {
    color: 'whiteAlpha.800',
    bgColor: 'whiteAlpha.50'
  };

  // style={({ isActive }) => ({ color: isActive ? 'green' : 'blue' })}

  return (
    <RouterLink to={to}>
      <HStack
        userSelect={'none'}
        color="whiteAlpha.600"
        borderRadius="5px"
        cursor="pointer"
        alignItems="center"
        fontWeight="semibold"
        _hover={hoverStyles}
        p="4px 10px"
        spacing="6px"
      >
        {children}
        {count && <Badge display="block" style={{ marginLeft: 'auto' }}>{count}</Badge>}
      </HStack>
    </RouterLink>
  );
}
