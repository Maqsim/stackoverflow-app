import { Button, ButtonProps } from '@chakra-ui/react';
import { IoIosArrowBack } from 'react-icons/io';

export function BackButton(props: ButtonProps) {
  return (
    <Button
      size="xs"
      variant="outline"
      pl="5px"
      leftIcon={<IoIosArrowBack />}
      iconSpacing="3px"
      onClick={() => window.history.back()}
      {...props}
    >
      Back
    </Button>
  );
}
