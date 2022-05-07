import { Text, TextProps } from "@chakra-ui/react";

type Props = {
  amount: number;
};

export function Bounty(props: Props & TextProps) {
  const { amount } = props;

  return (
    <Text
      as="span"
      title="Bounty"
      bgColor="blue.500"
      color="white"
      px="4px"
      fontSize="12px"
      fontWeight="bold"
      rounded="3px"
      {...props}
    >
      {amount}
    </Text>
  );
}
