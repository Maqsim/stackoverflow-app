import { UserType } from './UserType';

export type CommentType = {
  body: string;
  comment_id: number;
  creation_date: number;
  edited: boolean;
  owner: UserType;
  score: number;
  upvoted: boolean;
};
