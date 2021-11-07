import { CommentType } from './CommentType';

export type QuestionDetailsType = {
  answer_count: number;
  body: string;
  comments: CommentType[];
  comment_count: number;
  creation_date: number;
  is_answered: boolean;
  link: string;
  owner: any;
  question_id: number;
  score: number;
  tags: string[];
  title: string;
  upvoted: boolean;
  view_count: number;
};
