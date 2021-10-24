import { useEffect, useState } from 'react';
import { QuestionType } from '../interfaces/QuestionType';
import { QuestionListItem } from '../components/QuestionListItem';
import { api } from '../unitls/stackexchange-api';
import { Box, Button, ButtonGroup, Stack } from '@chakra-ui/react';

export function QuestionListPage() {
  const [questions, setQuestions] = useState<QuestionType[]>([]);

  useEffect(() => {
    api('questions/unanswered/my-tags', {
      order: 'desc',
      sort: 'creation',
      filter: '!tf94YAq2Z_YBzNChvK*abKSyjEtOGYp'
    }).then((response) => {
      setQuestions((response as any).items);
    });
  }, []);

  return (
    <>
      <Box mb="16px">
        <ButtonGroup size="xs" isAttached variant="outline">
          <Button mr="-px">Interesting</Button>
          <Button mr="-px">Bountied</Button>
          <Button>Hot</Button>
        </ButtonGroup>
      </Box>

      <Stack spacing="8px">
        {questions.map((question) => (
          <QuestionListItem item={question} key={question.question_id} />
        ))}
      </Stack>
    </>
  );
}
