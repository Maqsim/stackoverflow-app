import { Button, ButtonProps } from '@chakra-ui/react';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

export function BackButton(props: ButtonProps) {
  const navigate = useNavigate();

  return (
    <Button size="xs" variant="outline" pl="5px" leftIcon={<IoIosArrowBack/>} iconSpacing="3px" onClick={() => navigate(-1)} {...props}>
      Back
    </Button>
  );
}
