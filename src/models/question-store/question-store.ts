import { Instance, types } from 'mobx-state-tree';
import { QuestionModel, QuestionType } from './question';
import stackoverflow from '../../uitls/stackexchange-api';
import { PaginationController } from '../../hooks/use-pagination';
import { promiser } from '../../uitls/promiser';
// import { QuestionType } from "../../interfaces/QuestionType";

export const AllQuestionsFilter =
  '!HzgO6Jg6sME4H_1lyzjHHRxMDpvUVz34FqU_ckIV0XzN3qEw_80oXIpo62fBS4o8q9Wa31mkyd5kX4GFMvlXoA)k1AlLP';

export const QuestionStoreModel = types
  .model('QuestionStore')
  .props({
    isFetching: false,
    questions: types.optional(types.array(QuestionModel), [])
  })
  .actions((self) => ({
    setQuestions(questions: QuestionType[]) {
      self.questions.replace(questions);
    },
    setFetching(state: boolean) {
      self.isFetching = state;
    }
  }))
  .actions((self) => ({
    async getQuestions(pagination: PaginationController) {
      self.setFetching(true);

      const [response, error] = await promiser(
        stackoverflow.get('questions/unanswered/my-tags', {
          order: 'desc',
          sort: 'creation',
          page: pagination.page,
          pagesize: pagination.perPage,
          filter: AllQuestionsFilter
        })
      );

      self.setQuestions(response.items);
      pagination.setTotal(response.total);
      self.setFetching(false);
    }
  }));

type QuestionStoreType = Instance<typeof QuestionStoreModel>;

export interface QuestionStore extends QuestionStoreType {}

export const createAuthStoreDefaultModel = () => types.optional(QuestionStoreModel, {});
