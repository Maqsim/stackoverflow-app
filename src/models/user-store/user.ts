import { types } from 'mobx-state-tree';

export const UserModel = types.model({
  about_me: types.maybe(types.string),
  account_id: types.maybe(types.number),
  answer_count: types.maybe(types.number),
  creation_date: types.maybe(types.number),
  display_name: types.maybe(types.string),
  last_access_date: types.maybe(types.number),
  location: types.maybe(types.string),
  profile_image: types.maybe(types.string),
  question_count: types.maybe(types.number),
  reputation: types.maybe(types.number),
  user_id: types.maybe(types.number),
  view_count: types.maybe(types.number),
  website_url: types.maybe(types.string)
});
