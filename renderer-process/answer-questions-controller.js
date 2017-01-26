const moment = require('moment-twitter');
const _ = require('lodash');
const ipcRenderer = require('electron').ipcRenderer;
const stackexchange = require('./stackexchange-api-service');
const questionScreenService = require('./question-screen-service');
const reviewedQuestionsService = require('./reviewed-questions-service');
const questionListService = require('./question-list-service');
const answerQuestionSection = document.querySelector('#answer-questions-section');

// Load unanswered questions
stackexchange
  .fetch('questions/unanswered/my-tags', {
    order: 'desc',
    sort: 'creation',
    access_token: localStorage.token,
    filter: '!tf94YAq2Z_YBzNChvK*abKSyjEtOGYp'
  })
  .then(response => questionListService.renderQuestionList(response.items, answerQuestionSection));

// TODO remove me before release
window.loadQuestion = function (questionId) {
  stackexchange
    .fetch(`questions/${questionId}`, {
      access_token: localStorage.token,
      filter: '!tf94YAq2Z_YBzNChvK*abKSyjEtOGYp'
    })
    .then(response => {
      let question = response.items[0];

      questionScreenService.renderQuestion(question);
      reviewedQuestionsService.markAsReviewed(question);
    });
};
