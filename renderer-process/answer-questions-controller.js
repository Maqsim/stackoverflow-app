const moment = require('moment-twitter');
const _ = require('lodash');
const ipcRenderer = require('electron').ipcRenderer;
const stackexchange = require('./stackexchange-api-service');
const questionScreenService = require('./question-screen-service');

const questionScreenBackdrop = document.querySelector('.question-screen-backdrop');
const questionScreen = document.querySelector('.question-screen');
const answerQuestionSection = document.querySelector('#answer-questions-section');

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

ipcRenderer.on('stackexchange:login', (event, data) => {
  // Load unanswered questions
  stackexchange
    .fetch('questions/unanswered/my-tags', {
      order: 'desc',
      sort: 'creation',
      access_token: data.token,
      filter: '!tf94YAq2Z_YBzNChvK*abKSyjEtOGYp'
    })
    .then((response) => {
      const questions = response.items;
      const questionsParts = [];

      questions.forEach(question => {
        const timeAgo = moment(question.creation_date * 1000).twitter();
        const paragraphs = countInString('</p>', question.body);
        const codeBlocks = countInString('</pre>', question.body);
        const fiddles = countInString('jsfiddle.net', question.body);
        const images = countInString('i.stack.imgur.com', question.body) / 2; // Divide by 2 because images are wrapped to <a> with the same url
        // Reduce fiddles and images count because they counts like links
        const links = countInString('</a>', question.body) - fiddles - images;

        let questionInfo = [];

        if (codeBlocks || fiddles) {
          questionInfo.push('<i class="fa fa-code __green" title="With code"></i>');
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
            <div class="question-title">${question.title} <span class="question-time"> · ${timeAgo}</span></div>
            <ul class="question-tags">
              ${question.tags.map(tag => `<li>${tag}</li>`).join(' ')}
            </ul>
            <span class="question-comment-count">${questionInfo} &nbsp; ${scrollToCommentsTitle}</span>
          </div>
        `);
      });

      answerQuestionSection.innerHTML = questionsParts.join('');

      // Open question on click – delegated event
      answerQuestionSection.addEventListener('click', event => {
        // Get question div
        const questionElement = event.path.find(element => element.classList.contains('question'));
        const question = questions.find(question => question.question_id === +questionElement.dataset.id);

        questionScreenBackdrop.classList.add('is-shown');
        questionScreen.classList.add('is-shown');

        // TODO do not pass token through function
        questionScreenService.renderQuestion(question, data.token);
      });

      // Close question screen on click outside
      questionScreenBackdrop.addEventListener('click', () => {
        questionScreenBackdrop.classList.remove('is-shown');
        questionScreen.classList.remove('is-shown');
        questionScreenService.clearScreen();
      });
    });
});
