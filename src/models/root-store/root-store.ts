import { Instance, types } from 'mobx-state-tree';
import { QuestionStoreModel } from '../question-store/question-store';

export const RootStoreModel = types.model('RootStore').props({
  questionStore: types.optional(QuestionStoreModel, {} as any)
});

export interface RootStore extends Instance<typeof RootStoreModel> {}
