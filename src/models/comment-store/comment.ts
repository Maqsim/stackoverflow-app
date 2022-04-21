import { Instance, types } from 'mobx-state-tree';
import { UserModel } from '../user-store/user';

export const CommentModel = types.model({
  body: types.string,
  comment_id: types.number,
  creation_date: types.number,
  edited: types.boolean,
  owner: UserModel,
  score: types.number,
  upvoted: types.boolean
});

type CommentType = Instance<typeof CommentModel>;

export interface Comment extends CommentType {}
