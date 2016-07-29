const _ = require('lodash');
let pinnedQuestions = [];
try {
  pinnedQuestions = JSON.parse(localStorage.pinnedQuestions);
} catch (ignore) {}

function findPinnedQuestion(questionId) {
  syncLocalStorage();

  return _.find(pinnedQuestions, { question_id: questionId });
}

function syncLocalStorage() {
  localStorage.pinnedQuestions = JSON.stringify(pinnedQuestions);

  try {
    pinnedQuestions = JSON.parse(localStorage.pinnedQuestions);
  } catch (ignore) {}
}

exports.pin = function (question) {
  pinnedQuestions.push(question);
  syncLocalStorage();
};

exports.unpin = function (question) {
  const foundQuestion = findPinnedQuestion(question.question_id);

  if (foundQuestion) {
    pinnedQuestions = _.without(pinnedQuestions, foundQuestion);
  }

  syncLocalStorage();
};

exports.isPinned = function (question) {
  return Boolean(findPinnedQuestion(question.question_id));
};
