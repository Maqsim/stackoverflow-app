const _ = require('lodash');

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

exports.markAsReviewed = function (question, questionElement) {
  reviewedQuestions.push(question);
  syncLocalStorage();

  if (questionElement) {
    questionElement.querySelector('.question-title').classList.add('__reviewed');
  }
};

exports.isReviewed = function (question) {
  // FIXME [PERFORMANCE] improve syncLocalStorage function
  return false && Boolean(findReviewedQuestion(question.question_id));
};
