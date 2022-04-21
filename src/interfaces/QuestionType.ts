import { AnswerType } from './AnswerType';
import { CommentType } from './CommentType';

export type QuestionType = {
  answer_count: number;
  answers: AnswerType[];
  body: string;
  comment_count: number;
  comments?: CommentType[];
  creation_date: number;
  favorite_count: number;
  favorited: boolean;
  is_accepted: boolean;
  is_answered: boolean;
  link: string;
  owner: any;
  question_id: number;
  score: number;
  tags: string[];
  title: string;
  upvoted: boolean;
  downvoted: boolean;
  view_count: number;
};
