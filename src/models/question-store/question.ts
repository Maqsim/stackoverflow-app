import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { UserModel } from '../user-store/user';
import { CommentModel } from '../comment-store/comment';
import { AnswerModel } from '../answer-store/answer';

export const QuestionModel = types.model({
  answer_count: types.number,
  answers: types.optional(types.array(AnswerModel), []),
  body: types.string,
  bounty_amount: types.maybe(types.number),
  bounty_closes_date: types.maybe(types.number),
  bounty_user: types.maybe(UserModel),
  comment_count: types.number,
  comments: types.optional(types.array(CommentModel), []),
  creation_date: types.number,
  favorite_count: types.number,
  favorited: types.boolean,
  is_accepted: types.maybe(types.boolean),
  is_answered: types.boolean,
  link: types.string,
  owner: UserModel,
  question_id: types.number,
  score: types.number,
  tags: types.optional(types.array(types.string), []),
  title: types.string,
  upvoted: types.maybe(types.boolean),
  downvoted: types.maybe(types.boolean),
  view_count: types.number
});

export type QuestionType = Instance<typeof QuestionModel>;

type QuestionSnapshotType = SnapshotOut<typeof QuestionModel>;

export interface QuestionSnapshot extends QuestionSnapshotType {}

export interface Question extends QuestionType {}
