const moment = require('moment-twitter');

const questionScreenService = require('./question-screen-service');
const reviewedQuestionsService = require('./reviewed-questions-service');
const questionScreenBackdrop = document.querySelector('.question-screen-backdrop');
const questionScreen = document.querySelector('.question-screen');

function countInString(needly, haystack) {
  var results = 0;
  var a = haystack.indexOf(needly);

  while (a != -1) {
    haystack = haystack.slice(a * 1 + needly.length);
    results++;
    a = haystack.indexOf(needly);
  }

  return results;
}

function stripHtml(html) {
  var tmp = document.implementation.createHTMLDocument('New').body;
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

exports.renderQuestionList = function (questions, sectionElement) {
  const questionsParts = [];

  questions.forEach(question => {
    const timeAgo = moment(question.creation_date * 1000).twitter();
    const codeBlocks = countInString('</pre>', question.body);
    const fiddles = countInString('jsfiddle.net', question.body);
    const images = countInString('i.stack.imgur.com', question.body) / 2; // Divide by 2 because images are wrapped to <a> with the same url

    let questionInfo = [];

    if (codeBlocks || fiddles) {
      questionInfo.push('<i class="fa fa-code __green" title="With code"></i>');
    }

    if (images) {
      questionInfo.push('<i class="fa fa-picture-o __green" title="With images"></i>');
    }

    if (stripHtml(question.body).match(/[^\s]+/g).length > 200) {
      questionInfo.push('<i class="fa fa-clock-o __red" title="A lot of reading"></i>');
    }

    questionInfo = questionInfo.join(' &nbsp; ');

    const answerCountString = question.answer_count ? `${question.answer_count} <i class="fa fa-check-circle"></i>&nbsp;` : '';
    const commentCountString = question.comment_count ? `${question.comment_count} <i class="fa fa-comments-o"></i>` : '';
    let likeCountString = question.score > 0 ? `<i class="fa fa-heart"></i> ${question.score}` : '';
    likeCountString = (answerCountString || commentCountString) && likeCountString ? '&nbsp;&nbsp;&nbsp;' + likeCountString : '';

    const scrollToCommentsTitle = (answerCountString + ' ' + commentCountString + ' ' + likeCountString).trim();

    questionsParts.push(`
          <div class="question" data-id="${question.question_id}">
            <div class="question-title ${reviewedQuestionsService.isReviewed(question) ? '__reviewed' : ''}">${question.title} <span class="question-time"> · ${timeAgo}</span></div>
            <ul class="question-tags">
              ${question.tags.map(tag => `<li>${tag}</li>`).join(' ')}
            </ul>
            <span class="question-comment-count">${questionInfo} &nbsp; ${scrollToCommentsTitle}</span>
          </div>
        `);
  });

  sectionElement.innerHTML = questionsParts.join('');

  // Open question on click – delegated event
  sectionElement.addEventListener('click', event => {
    // Get question div
    const questionElement = event.path.find(element => element.classList.contains('question'));
    const question = questions.find(question => question.question_id === +questionElement.dataset.id);

    questionScreenService.renderQuestion(question, localStorage.token);
    reviewedQuestionsService.markAsReviewed(question, questionElement);
  });

  // Close question screen on click outside
  questionScreenBackdrop.addEventListener('click', () => {
    questionScreenBackdrop.classList.remove('is-shown');
    questionScreen.classList.remove('is-shown');
    questionScreenService.clearScreen();
  });
};
