const moment = require('moment');
const ipcRenderer = require('electron').ipcRenderer;
const stackexchange = require('./stackexchange-api');
const questionScreenService = require('./question-screen-service');

let questionScreenBackdrop = document.querySelector('.question-screen-backdrop');
let questionScreen = document.querySelector('.question-screen');
let answerQuestionSection = document.querySelector('#answer-questions-section');

const countInString = (needly, haystack) => {
  var results = 0;
  var a = haystack.indexOf(needly);

  while (a != -1) {
    haystack = haystack.slice(a * 1 + needly.length);
    results++;
    a = haystack.indexOf(needly);
  }

  return results;
};

ipcRenderer.on('stackexchange:login', (event, data) => {
  stackexchange
    .fetch('questions/unanswered/my-tags', {
      order: 'desc',
      sort: 'creation',
      access_token: data.token,
      filter: '!.Iwe-BCqk3L4jlmCTCqYbursXuIE_'
    })
    .then((response) => {
      let questions = response.items;
      let questionsParts = [];

      questions.forEach((question) => {
        const timeAgo = moment(question.creation_date * 1000).fromNow();
        const paragraphs = countInString('</p>', question.body);
        const codeBlocks = countInString('</pre>', question.body);
        const fiddles = countInString('jsfiddle.net', question.body);
        const images = countInString('i.stack.imgur.com', question.body) / 2; // Divide by 2 because images are wrapped to <a> with the same url
        // Reduce fiddles and images count because they counts like links
        const links = countInString('</a>', question.body) - fiddles - images;

        let questionInfo = `${paragraphs ? paragraphs + ' paragraphs, ' : ''}` +
          `${codeBlocks ? codeBlocks + ' code-blocks, ' : ''}` +
          `${links ? links + ' links, ' : ''}` +
          `${fiddles ? fiddles + ' JS Fiddle, ' : ''}`;

        // Clear ', ' in the end
        questionInfo = questionInfo.substring(0, questionInfo.length - 2);

        questionsParts.push(`
          <div class="question" data-id="${question.question_id}">
            <div class="question-title">${question.title}</div>
            <div class="question-info">${questionInfo}</div>
            <ul class="question-tags">
              ${question.tags.map((tag) => `<li>${tag}</li>`).join(' ')}
            </ul>
            <span class="question-time">
              ${timeAgo}
              <a tabindex="-1" href="${question.owner.link}">${question.owner.display_name}</a>
            </span>
          </div>
        `);
      });

      answerQuestionSection.innerHTML = questionsParts.join('');

      // Open question on click – delegated event
      answerQuestionSection.addEventListener('click', event => {
        // Get question div
        let questionElement = event.path.find(element => element.classList.contains('question'));
        let question = questions.find(question => question.question_id === +questionElement.dataset.id);
        
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
