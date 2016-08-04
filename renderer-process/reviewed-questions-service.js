const _ = require('lodash');
const $ = require('jquery');

let reviewedQuestions = [];
try {
  reviewedQuestions = JSON.parse(localStorage.reviewedQuestions);
} catch (ignore) {}

function findReviewedQuestion(questionId) {
  syncLocalStorage();

  return _.find(reviewedQuestions, { question_id: questionId });
}

function syncLocalStorage() {
  localStorage.reviewedQuestions = JSON.stringify(reviewedQuestions);

  try {
    reviewedQuestions = JSON.parse(localStorage.reviewedQuestions);
  } catch (ignore) {}
}

exports.get = function () {
  return reviewedQuestions;
};

exports.markAsReviewed = function (question) {
  reviewedQuestions.push(question);
  syncLocalStorage();
};

exports.isReviewed = function (question) {
  return Boolean(findReviewedQuestion(question.question_id));
};
