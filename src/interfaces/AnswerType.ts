import { UserType } from './UserType';
import { CommentType } from './CommentType';

export type AnswerType = {
  accepted: boolean;
  answer_id: number;
  body: string;
  can_comment: boolean;
  comment_count: number;
  comments?: CommentType[];
  creation_date: number;
  downvoted: boolean;
  is_accepted: boolean;
  owner: UserType;
  question_id?: number;
  score: number;
  title?: string;
  upvoted: boolean;
};
