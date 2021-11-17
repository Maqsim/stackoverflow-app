import { Box, Skeleton, Stat, StatGroup, StatLabel, StatNumber } from '@chakra-ui/react';
import { kFormatter } from '../../uitls/k-formatter';
import { UserType } from '../../interfaces/UserType';

type Props = {
  user?: UserType;
};

export function Statistics({ user }: Props) {
  const isLoading = !user;

  return (
    <Box rounded="5px" border="1px solid" borderColor="gray.200" p="16px">
      {isLoading ? (
        <>
          <StatGroup>
            <Stat>
              <StatLabel>Reputation</StatLabel>
              <StatNumber>
                <Skeleton h="26px" mt="6px" mb="4px" w="70%" />
              </StatNumber>
            </Stat>

            <Stat>
              <StatLabel>Views</StatLabel>
              <StatNumber>
                <Skeleton h="26px" mt="6px" mb="4px" w="60%" />
              </StatNumber>
            </Stat>
          </StatGroup>

          <StatGroup mt="12px">
            <Stat>
              <StatLabel>Questions</StatLabel>
              <StatNumber>
                <Skeleton h="26px" mt="6px" mb="4px" w="30%" />
              </StatNumber>
            </Stat>

            <Stat>
              <StatLabel>Answers</StatLabel>
              <StatNumber>
                <Skeleton h="26px" mt="6px" mb="4px" w="30%" />
              </StatNumber>
            </Stat>
          </StatGroup>
        </>
      ) : (
        <>
          <StatGroup>
            <Stat>
              <StatLabel>Reputation</StatLabel>
              <StatNumber>{kFormatter(user.reputation)}</StatNumber>
            </Stat>

            <Stat>
              <StatLabel>Views</StatLabel>
              <StatNumber>{kFormatter(user.view_count)}</StatNumber>
            </Stat>
          </StatGroup>

          <StatGroup mt="12px">
            <Stat>
              <StatLabel>Questions</StatLabel>
              <StatNumber>{kFormatter(user.question_count)}</StatNumber>
            </Stat>

            <Stat>
              <StatLabel>Answers</StatLabel>
              <StatNumber>{kFormatter(user.answer_count)}</StatNumber>
            </Stat>
          </StatGroup>
        </>
      )}
    </Box>
  );
}
