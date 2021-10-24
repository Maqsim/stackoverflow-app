import { useEffect, useState } from 'react';
import { api } from '../unitls/stackexchange-api';
import { useLocation, useParams } from 'react-router-dom';
import { Box, Button, Flex, Heading, HStack, Spinner, Tooltip } from '@chakra-ui/react';
import { QuestionDetailsType } from '../interfaces/QuestionDetailsType';
import { QuestionType } from '../interfaces/QuestionType';
import parse from 'html-react-parser';
import { BackButton } from '../components/BackButton';
import { RiEarthFill, RiFileCopyFill } from 'react-icons/ri';

let tooltipTimerId: NodeJS.Timer;

export function QuestionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const initialQuestion = location.state as QuestionType;
  const [question, setQuestion] = useState<QuestionDetailsType>(initialQuestion as QuestionDetailsType);
  const [isTooltipShown, setIsTooltipShown] = useState(false);

  useEffect(() => {
    if (!question) {
      api(`questions/${id}`, {
        filter: '!T1gn2_Z7sHTWd5)zc*'
      }).then((response) => {
        setQuestion((response as any).items[0]);
      });
    }
  }, []);

  function openInBrowser() {
    window.open(question.link);
  }

  function copyUrl() {
    clearTimeout(tooltipTimerId);

    setIsTooltipShown(true);
    window.Main.copyToClipboard(question.link);

    tooltipTimerId = setTimeout(() => {
      setIsTooltipShown(false);
    }, 2000);
  }

  if (!question) {
    return <Spinner />;
  }

  return (
    <Box>
      <Flex mb="24px" justify="space-between">
        <BackButton />
        <HStack spacing="4px">
          <Button onClick={openInBrowser} size="xs" variant="outline" leftIcon={<RiEarthFill />} iconSpacing="3px">
            Open in browser
          </Button>

          <Tooltip label="Copied!" isOpen={isTooltipShown}>
            <Button onClick={copyUrl} size="xs" variant="outline" leftIcon={<RiFileCopyFill />} iconSpacing="3px">
              Copy URL
            </Button>
          </Tooltip>
        </HStack>
      </Flex>

      <Heading size="md" mb="16px">
        {parse(question.title)}
      </Heading>
      <Box>{parse(question.body)}</Box>
    </Box>
  );
}
