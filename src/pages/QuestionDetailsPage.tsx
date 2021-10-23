import { useEffect, useState } from "react";
import { api } from "../unitls/stackexchange-api";
import { Link as RouterLink, useParams } from "react-router-dom";
import { Box, Button, Spinner, Text } from "@chakra-ui/react";
import { QuestionDetailsType } from "../interfaces/QuestionDetailsType";

export function QuestionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<QuestionDetailsType>();

  useEffect(() => {
    api(`questions/${id}`, {
      filter: "!T1gn2_Z7sHTWd5)zc*",
    }).then((response) => {
      setQuestion((response as any).items[0]);
    });
  }, []);

  if (!question) {
    return <Spinner />;
  }

  return (
    <Box>
      <RouterLink to={`/`}>
        <Button size="xs">Back</Button>
      </RouterLink>
      <Text>{question.title}</Text>
      <Text>{question.body}</Text>
    </Box>
  );
}
