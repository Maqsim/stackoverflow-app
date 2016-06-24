const moment = require('moment');
const delegate = require('delegate');
const SimpleMDE = require('simplemde');
const stackexchange = require('./stackexchange-api');
const {asyncInnerHTML} = require('./utils');

function createCommentLayout(comment) {
  const timeAgo = moment(comment.creation_date * 1000).fromNow();
  const loggedInUserId = Number(localStorage.userId);

  return `
    <div class="question-comments-list-item ${loggedInUserId === comment.owner.user_id ? '__my-comment' : ''}" data-id="${comment.comment_id}">
      ${comment.body}
      –
      <a class="question-comments-profile-link" href="${comment.owner.link}">${comment.owner.display_name}</a>
      <span class="text-muted">${timeAgo}</span>
      <span class="question-comments-controls">
        &nbsp;
        <a class="question-comments-controls-edit" href="#">edit</a>
        <span class="text-muted">·</span>
        <a class="question-comments-controls-remove" href="#">remove</a>
      </span>
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

    document.querySelector('.question-screen-content').innerHTML += `
      <div class="question-comments">
        <div class="question-comments-list"></div>
        <form class="question-comments-form">
          <input type="text" placeholder="Add your comment here. Avoid answering questions in comments">
          <small class="question-comments-form-tip" style="margin-left: 4px;">Shift + Enter – start answering</small>
        </form>
        <div class="question-comments-form-errors"></div>
      </div>
    `;

    const commentForm = document.querySelector('.question-screen-content form');
    const formTip = document.querySelector('.question-comments-form-tip');

    // Load and render comments
    stackexchange
      .fetch(`questions/${question.question_id}/comments`, {
        order: 'asc',
        sort: 'creation',
        filter: '!*Ju*loZ-vYZpgswx'
      })
      .then((response) => {
        document.querySelector('.question-comments-list').innerHTML = response.items.map(createCommentLayout).join('');
      });

    let commentInput = document.querySelector('.question-comments-form input');
    let formErrors = document.querySelector('.question-comments-form-errors');

    // When you press Enter on comment form
    commentForm.addEventListener('submit', event => {
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
    });

    commentForm.addEventListener('keydown', function (event) {
      if (event.shiftKey && event.which === 13) {
        event.preventDefault();

        // Expand form to start answering – init SimpleMDE
        new SimpleMDE({
          element: commentInput,
          autofocus: true,
          status: false,
          toolbarTips: false,
          toolbar: ['bold', 'italic', '|', 'link', 'quote', 'code', 'image', '|', 'ordered-list', 'unordered-list', 'heading', 'horizontal-rule'],
          autoDownloadFontAwesome: false,
          placeholder: 'Your answer'
        });

        // Remove Shift + Enter tip
        formTip.parentNode.removeChild(formTip);

        // Unbind the handler
        this.removeEventListener('keydown', arguments.callee);
      }
    });

    // Remove comment
    delegate(document.querySelector('.question-comments-list'), '.question-comments-controls-remove', 'click', event => {
      const commentElement = event.target.closest('.question-comments-list-item');
      const commentId = commentElement.dataset.id;

      stackexchange
        .fetch(`comments/${commentId}/delete`, null, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: encodeURI(`access_token=${token}&key=bdFSxniGkNbU3E*jsj*28w((&preview=false&site=stackoverflow`)
        })
        .then(() => {
          commentElement.parentNode.removeChild(commentElement);
        });
    });

    // Edit comment
    delegate(document.querySelector('.question-comments-list'), '.question-comments-controls-edit', 'click', event => {
      const commentElement = event.target.closest('.question-comments-list-item');
      const commentId = commentElement.dataset.id;

      // TODO implement comment editing
    });

    // TODO Load answers
  });
};

exports.clearScreen = () => {
  document.querySelector('.question-screen-content').innerHTML = '';
};
