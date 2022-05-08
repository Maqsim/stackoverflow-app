import { Instance, types } from 'mobx-state-tree';
import { QuestionModel, QuestionType } from './question';
import stackoverflow from '../../uitls/stackexchange-api';
import { PaginationController } from '../../hooks/use-pagination';
import { promiser } from '../../uitls/promiser';
import { ResponseType } from '../../interfaces/Response';

export const AllQuestionsFilter =
  '!HzgO6Jg6sME4H_1lyzjHHRxMDyjoWkuK(8Xe125IMyd4rNGmzV(xVm79voQW*H7_CY)rZkEokE8LKn2_KZ4TJ5F0.2rZ1';

export const QuestionStoreModel = types
  .model('QuestionStore')
  .props({
    isQuestionsFetching: false,
    questionsFilter: types.optional(
      types.enumeration('QuestionsFilter', ['interesting', 'bountied', 'hot']),
      'interesting'
    ),
    questions: types.optional(types.array(QuestionModel), []),
    myQuestions: types.optional(types.array(QuestionModel), [])
  })
  .actions((self) => ({
    setQuestions(questions: QuestionType[]) {
      self.questions.replace(questions);
    },
    setIsQuestionsFetching(state: boolean) {
      self.isQuestionsFetching = state;
    },
    setQuestionsFilter(filter: 'interesting' | 'bountied' | 'hot') {
      self.questionsFilter = filter;
    }
  }))
  .actions((self) => ({
    async getQuestions(filter: 'interesting' | 'bountied' | 'hot', pagination: PaginationController) {
      self.setIsQuestionsFetching(true);

      // Compose question API url based on filter
      let url = 'questions/unanswered/my-tags';
      const params = {
        order: 'desc',
        sort: 'creation',
        page: pagination.page,
        pagesize: pagination.perPage,
        filter: AllQuestionsFilter
      };

      if (filter === 'bountied') {
        url = 'questions/featured';
        params.sort = 'activity';
      } else if (filter === 'hot') {
        url = 'questions';
        params.sort = 'hot';
      }

      const [response, error] = await promiser<ResponseType<QuestionType>>(stackoverflow.get(url, params));

      self.setQuestions(response.items);
      pagination.setTotal(response.total);
      self.setIsQuestionsFetching(false);
    }
  }));

type QuestionStoreType = Instance<typeof QuestionStoreModel>;

export interface QuestionStore extends QuestionStoreType {
}

export const createAuthStoreDefaultModel = () => types.optional(QuestionStoreModel, {});
