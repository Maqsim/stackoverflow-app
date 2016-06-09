const moment = require('moment');

fetch('https://api.stackexchange.com/2.2/questions?order=desc&sort=creation&site=stackoverflow').then(function (response) {
  response.json().then(function (data) {
    let questions = data.items;

    questions.forEach((question) => {
      const timeAgo = moment(question.creation_date * 1000).fromNow();
      let div = document.createElement('div');
      div.classList.add('question');
      div.innerHTML = `
        <div class="question">
          <div class="question-title">${question.title}</div>
          <div class="question-info">2 paraghaphs, 1 code-block, 1 JSFiddle</div>
          <ul class="question-tags">
            ${question.tags.map((tag, last) => `<li>${tag}</li>`).join(' ')}
          </ul>
          <span class="question-time">
            ${timeAgo}
            <a href="${question.owner.link}">${question.owner.display_name}</a>
          </span>
        </div>
      `;
      
      document.querySelector('#answer-questions-section').appendChild(div);
    });
  });
});
