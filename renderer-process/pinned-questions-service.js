const _ = require('lodash');
const $ = require('jquery');

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

exports.updateMenuItem = function () {
  $('#pinned-questions')
    .toggle(Boolean(pinnedQuestions.length))
    .find('.pinned-questions-counter')
    .html(pinnedQuestions.length);
};

exports.get = function () {
  return pinnedQuestions;
};

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
