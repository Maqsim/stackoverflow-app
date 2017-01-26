const moment = require('moment');
const stackexchange = require('./stackexchange-api-service');
const pinnedQuestionsService = require('./pinned-questions-service');
const questionListService = require('./question-list-service');
const pinnedQuestionSection = document.querySelector('#pinned-questions-section');

// Load/update pinned questions
stackexchange
  .fetch(`questions/${pinnedQuestionsService.getIds().join(';')}`, {
    order: 'desc',
    sort: 'creation',
    access_token: localStorage.token,
    filter: '!tf94YAq2Z_YBzNChvK*abKSyjEtOGYp'
  })
  .then(response => questionListService.renderQuestionList(response.items, pinnedQuestionSection));
