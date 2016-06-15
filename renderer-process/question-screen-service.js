const moment = require('moment');
const stackexchange = require('./stackexchange-api');
const {asyncInnerHTML} = require('./utils');

function createCommentLayout(comment) {
  const timeAgo = moment(comment.creation_date * 1000).fromNow();

  return `
    <div class="question-comments-list-item">
      ${comment.body}
      –
      <a href="${comment.owner.link}">${comment.owner.display_name}</a>
      <span class="text-muted">${timeAgo}</span>
    </div>
  `;
}

exports.renderQuestion = (question, token) => {
  asyncInnerHTML(question.body, (questionBodyHtml) => {
    document.querySelector('.question-screen-content').innerHTML = `
      <div class="question-title"><a href="${question.link}">${question.title}</a></div>
    `;

    document.querySelector('.question-screen-content').appendChild(questionBodyHtml);

    // Beautify code
    const codeBlocks = document.querySelectorAll('pre code');
    Array.prototype.forEach.call(codeBlocks, (code) => {
      code.classList.add('prettyprint');
    });

    prettyPrint();

    // Load and render comments
    stackexchange
      .fetch(`questions/${question.question_id}/comments`, {
        order: 'asc',
        sort: 'creation',
        filter: '!*Ju*loZ-vYZpgswx'
      })
      .then((response) => {
        let comments = response.items;

        document.querySelector('.question-screen-content').innerHTML += `
          <div class="question-comments">
            <div class="question-comments-list">
              ${comments.map(createCommentLayout).join('')}
            </div>
            <form class="question-comments-form">
              <input type="text" placeholder="Add your comment here. Avoid answering questions in comments">
            </form>
            <div class="question-comments-form-errors"></div>
          </div>
        `;

        let commentInput = document.querySelector('.question-comments-form input');
        let formErrors = document.querySelector('.question-comments-form-errors');

        // When you press Enter on comment form
        document.querySelector('.question-screen-content form').addEventListener('submit', event => {
          event.preventDefault();

          // Clear errors
          formErrors.innerHTML = '';

          const commentText = commentInput.value.trim();

          // Client-side validation
          if (!commentText) {
            return;
          } else if (commentText.length < 15) {
            return formErrors.innerHTML = 'Comments must be at least 15 characters in length.';
          }

          stackexchange
            .fetch(`posts/${question.question_id}/comments/add`, null, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: encodeURI(`access_token=${token}&key=bdFSxniGkNbU3E*jsj*28w((&body=${commentText}&preview=false&site=stackoverflow`)
            })
            .then((response) => {
              // Server-side validation (if not pass)
              if (response.error_id) {
                return formErrors.innerHTML = response.error_message;
              }

              // Render successfully added comment
              let savedComment = response.items[0];
              savedComment.body = commentText;

              document.querySelector('.question-comments-list').innerHTML += createCommentLayout(savedComment);

              // Clear input
              commentInput.value = '';
            });
        })
      });

    // TODO Load answers
  });
};

exports.clearScreen = () => {
  document.querySelector('.question-screen-content').innerHTML = '';
};
