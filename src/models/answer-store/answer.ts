import { Instance, types } from 'mobx-state-tree';
import { UserModel } from '../user-store/user';
import { CommentModel } from '../comment-store/comment';

export const AnswerModel = types.model({
  accepted: types.maybe(types.boolean),
  answer_id: types.maybe(types.number),
  body: types.maybe(types.string),
  can_comment: types.maybe(types.boolean),
  comment_count: types.maybe(types.number),
  comments: types.optional(types.array(CommentModel), []),
  creation_date: types.maybe(types.number),
  downvoted: types.maybe(types.boolean),
  is_accepted: types.maybe(types.boolean),
  owner: types.maybe(UserModel),
  question_id: types.maybe(types.number),
  score: types.maybe(types.number),
  title: types.maybe(types.string),
  upvoted: types.maybe(types.boolean)
});

type AnswerType = Instance<typeof AnswerModel>;

export interface Answer extends AnswerType {}
