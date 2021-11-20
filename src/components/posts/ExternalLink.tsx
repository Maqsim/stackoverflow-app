import { Link, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { FiExternalLink } from 'react-icons/fi';

type Props = {
  href: string;
  children: ReactNode;
};

export function ExternalLink({ href, children }: Props) {
  return (
    <Text as="span">
      <Link href={href} color="blue.500" textDecor="underline" rel="noreferrer">
        {children}
      </Link>

      <Text as="span" display="inline-block" color="#aaa" fontSize="12px" h="11px" ml="3px">
        <FiExternalLink />
      </Text>
    </Text>
  );
}
