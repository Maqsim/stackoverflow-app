import { Instance, types } from 'mobx-state-tree';
import { QuestionModel, QuestionType } from './question';
import stackoverflow from '../../uitls/stackexchange-api';
import { PaginationController } from '../../hooks/use-pagination';
import { promiser } from '../../uitls/promiser';
import { ResponseType } from '../../interfaces/Response';
import { AnswerType } from '../../interfaces/AnswerType';

export const ALL_QUESTIONS_FILTER =
  '!HzgO6Jg6sME4H_1lyzjHHRxMDyjoWkuK(8Xe125IMyd4rNGmzV(xVm79voQW*H7_CY)rZkEokE8LKn2_KZ4TJ5F0.2rZ1';

async function getMyAnswersQuestionIds(page: number, perPage: number) {
  const [response, error] = await promiser<ResponseType<AnswerType>>(
    stackoverflow.get('me/answers', {
      order: 'desc',
      sort: 'creation',
      page,
      pagesize: perPage,
      filter: '!AH)b5JZk)e5p'
    })
  );

  const ids = response.items.map((answer: AnswerType) => answer.question_id);

  return [ids, response.total];
}

export const QuestionStoreModel = types
  .model('QuestionStore')
  .props({
    isQuestionsFetching: false,
    isMyBookmarksFetching: false,
    isMyQuestionsFetching: false,
    isMyAnswersFetching: false,
    questionsFilter: types.optional(
      types.enumeration('QuestionsFilter', ['interesting', 'bountied', 'hot']),
      'interesting'
    ),
    questions: types.optional(types.array(QuestionModel), []),
    myBookmarks: types.optional(types.array(QuestionModel), []),
    myQuestions: types.optional(types.array(QuestionModel), []),
    myAnswers: types.optional(types.array(QuestionModel), [])
  })
  .actions((self) => ({
    setQuestions(questions: QuestionType[]) {
      self.questions.replace(questions);
    },
    setMyBookmarks(questions: QuestionType[]) {
      self.myBookmarks.replace(questions);
    },
    setMyQuestions(questions: QuestionType[]) {
      self.myQuestions.replace(questions);
    },
    setMyAnswers(questions: QuestionType[]) {
      self.myAnswers.replace(questions);
    },
    setIsQuestionsFetching(state: boolean) {
      self.isQuestionsFetching = state;
    },
    setIsMyBookmarksFetching(state: boolean) {
      self.isMyBookmarksFetching = state;
    },
    setIsMyQuestionsFetching(state: boolean) {
      self.isMyQuestionsFetching = state;
    },
    setIsMyAnswersFetching(state: boolean) {
      self.isMyAnswersFetching = state;
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
        filter: ALL_QUESTIONS_FILTER
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
    },
    async getMyBookmarks(pagination: PaginationController) {
      self.setIsMyBookmarksFetching(true);

      const [response, error] = await promiser<ResponseType<QuestionType>>(
        stackoverflow.get('me/favorites', {
          order: 'desc',
          sort: 'added',
          page: pagination.page,
          pagesize: pagination.perPage,
          filter: ALL_QUESTIONS_FILTER
        })
      );

      self.setMyBookmarks(response.items);
      pagination.setTotal(response.total);
      self.setIsMyBookmarksFetching(false);
    },
    async getMyQuestions(pagination: PaginationController) {
      self.setIsMyQuestionsFetching(true);

      const [response, error] = await promiser<ResponseType<QuestionType>>(
        stackoverflow.get('me/questions', {
          order: 'desc',
          sort: 'creation',
          page: pagination.page,
          pagesize: pagination.perPage,
          filter: ALL_QUESTIONS_FILTER
        })
      );

      self.setMyQuestions(response.items);
      pagination.setTotal(response.total);
      self.setIsMyQuestionsFetching(false);
    },
    async getMyAnswers(pagination: PaginationController) {
      self.setIsMyAnswersFetching(true);

      const [questionIds, answerTotal] = await getMyAnswersQuestionIds(pagination.page, pagination.perPage);

      if (questionIds.length === 0) {
        self.setIsMyAnswersFetching(false);
        return;
      }

      const [response, error] = await promiser<ResponseType<QuestionType>>(
        stackoverflow.get(`questions/${questionIds.join(';')}`, {
          order: 'desc',
          sort: 'creation',
          filter: ALL_QUESTIONS_FILTER
        })
      );

      self.setMyAnswers(response.items);
      pagination.setTotal(answerTotal);
      console.log('toggle flag');
      self.setIsMyAnswersFetching(false);
    }
  }));

type QuestionStoreType = Instance<typeof QuestionStoreModel>;

export interface QuestionStore extends QuestionStoreType {}

export const createAuthStoreDefaultModel = () => types.optional(QuestionStoreModel, {});
