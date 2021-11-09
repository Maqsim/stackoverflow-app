import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import stackoverflow from '../unitls/stackexchange-api';
import { useUser } from './use-user';

type CountsType = {
  bookmarks?: number;
  questions?: number;
  answers?: number;
  tags?: number;
};

export type SidebarContextState = {
  counts: CountsType;
  setBookmarkCount: (value: number) => void;
  setQuestionCount: (value: number) => void;
  setAnswerCount: (value: number) => void;
  setTagCount: (value: number) => void;
};

export const SidebarContext = createContext<SidebarContextState>({} as SidebarContextState);

type Props = {
  children: ReactNode;
};

export const SidebarProvider = ({ children }: Props) => {
  const user = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarkCount, setBookmarkCount] = useState<number>();
  const [questionCount, setQuestionCount] = useState<number>();
  const [answerCount, setAnswerCount] = useState<number>();
  const [tagCount, setTagCount] = useState<number>();

  const sharedState: SidebarContextState = {
    counts: {
      bookmarks: bookmarkCount,
      questions: questionCount,
      answers: answerCount,
      tags: tagCount
    },
    setBookmarkCount,
    setQuestionCount,
    setAnswerCount,
    setTagCount
  };

  async function fetchCounts() {
    const bookmarkCountResponse: any = await stackoverflow.get('me/favorites', { filter: 'total' });
    const questionCountResponse: any = await stackoverflow.get('search/advanced', {
      user: user.data.user_id,
      filter: 'total'
    });
    const answerCountResponse: any = await stackoverflow.get('me/answers', { filter: 'total' });
    const tagCountResponse: any = await stackoverflow.get('me/tags', { filter: 'total' });

    setBookmarkCount(bookmarkCountResponse.total);
    setQuestionCount(questionCountResponse.total);
    setAnswerCount(answerCountResponse.total);
    setTagCount(tagCountResponse.total);
  }

  useEffect(() => {
    fetchCounts();
  }, []);

  return <SidebarContext.Provider value={sharedState}>{children}</SidebarContext.Provider>;
};

export const useSidebar = () => {
  return useContext(SidebarContext);
};
