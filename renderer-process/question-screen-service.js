const moment = require('moment');
const delegate = require('delegate');
const SimpleMDE = require('simplemde');
const stackexchange = require('./stackexchange-api-service');
const pinnedQuestions = require('./pinned-questions-service');
const { asyncInnerHTML, colorize } = require('./utils');
const $ = require('jquery');

function createCommentLayout(comment) {
  const timeAgo = moment(comment.creation_date * 1000).fromNow();
  const loggedInUserId = Number(localStorage.userId);

  return `
    <div class="question-comments-list-item ${loggedInUserId === comment.owner.user_id ? '__my' : ''}" data-id="${comment.comment_id}">
      <nobr>
        <span class="question-comments-profile-color" style="background: ${colorize(comment.owner.user_id)}"></span>
        <a class="question-comments-profile-link" href="${comment.owner.link}">${comment.owner.display_name}</a>
      </nobr> ${comment.body}
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

// TODO make answers look more sick and figure out how to show comments to the answers
function createAnswerLayout(answer) {
  const timeAgo = moment(answer.creation_date * 1000).fromNow();
  const loggedInUserId = Number(localStorage.userId);

  return `
    <div class="question-comments-list-item question-comments-answer ${loggedInUserId === answer.owner.user_id ? '__my' : ''}" data-id="${answer.answer_id}">
      ${answer.body}
      –
      <a class="question-comments-profile-link" href="${answer.owner.link}">${answer.owner.display_name}</a>
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
  const questionScreenContentElement = document.querySelector('.question-screen-content');

  asyncInnerHTML(question.body, (questionBodyHtml) => {
    questionScreenContentElement.innerHTML = `
      <div class="question-title"><a href="${question.link}">${question.title}</a></div>
    `;

    questionScreenContentElement.appendChild(questionBodyHtml);

    // Beautify code
    const codeBlocks = document.querySelectorAll('pre code');
    Array.prototype.forEach.call(codeBlocks, (code) => {
      code.classList.add('prettyprint');
    });

    prettyPrint();

    const answerCountString = question.answer_count ? `${question.answer_count} <i class="fa fa-check-circle"></i>&nbsp;` : '';
    const commentCountString = question.comment_count ? `${question.comment_count} <i class="fa fa-comments-o"></i>` : 'Add your comment...';
    const scrollToCommentsTitle = (answerCountString + ' ' + commentCountString).trim();

    questionScreenContentElement.innerHTML += `
      <div class="question-comments" id="scroll-to-comments">
        <div class="question-status-bar">
          <a class="question-status-bar-action" href="#scroll-to-comments">${scrollToCommentsTitle}</a>
          <a class="question-status-bar-action"><i class="fa fa-refresh"></i></a>
          <a class="question-status-bar-action pin"><i class="fa fa-thumb-tack ${!pinnedQuestions.isPinned(question) ? 'rotate-45' : ''}"></i></i></a>
          <a class="question-status-bar-action"><i class="fa fa-share-square"></i></i></a>
          <a class="question-status-bar-action"><i class="fa fa-jsfiddle"></i></a>
          <a class="question-status-bar-action"><i class="fa fa-github"></i></i></a>
          
          <a class="question-status-bar-action __right" href="${question.owner.link}">
            <img class="question-status-bar-profile-image" src="${question.owner.profile_image}" alt="">
            ${question.owner.display_name}
          </a>
        </div>
        <div class="question-comments-list"></div>
        <form class="question-comments-form">
          <input type="text" placeholder="Your comment. Press Shift + Enter to start answer">
          <div class="question-answer-buttons">
            <button type="button" class="button __success post-answer">Post</button>
            <button type="button" class="button discard-changes">Cancel</button>
          </div>
        </form>
        <div class="question-comments-form-errors"></div>
      </div>
    `;

    $('.pin').click(function () {
      if (pinnedQuestions.isPinned(question)) {
        $('.fa', this).addClass('rotate-45');
        pinnedQuestions.unpin(question);
      } else {
        $('.fa', this).removeClass('rotate-45');
        pinnedQuestions.pin(question);
      }
    });

    // Load and render comments
    stackexchange
      .fetch(`questions/${question.question_id}/comments`, {
        order: 'asc',
        sort: 'creation',
        filter: '!*Ju*loZ-vYZpgswx'
      })
      .then((response) => {
        document.querySelector('.question-comments-list').innerHTML = response.items.map(createCommentLayout).join('');

        // const mockAnswerData = JSON.parse('{"owner":{"reputation":989,"user_id":1453833,"user_type":"registered","profile_image":"https://www.gravatar.com/avatar/cc814c87d49cffb16bd3785ed8a1fb1d?s=128&d=identicon&r=PG","display_name":"Max","link":"http://stackoverflow.com/users/1453833/max"},"comment_count":0,"is_accepted":false,"score":0,"creation_date":1469662633,"answer_id":38624870,"question_id":38624835,"link":"http://stackoverflow.com/questions/38624835//38624870#38624870","body":"<p>!)s0G2lBkPFy_lEEcsfX9!)s0G2lBkPFy_lEEcsfX9!)s0G2lBkPFy_lEEcsfX9</p>"}');
        // document.querySelector('.question-comments-list').innerHTML = createAnswerLayout(mockAnswerData);
      });

    // Make status bar sticky
    const $questionScreen = $('.question-screen');
    const $statusBar = $('.question-status-bar');
    // const $statusBarClone = $statusBar
    //   .clone()
    //   .hide()
    //   .addClass('__sticky')
    //   .insertAfter($statusBar);
    const statusBarElementTop = $statusBar.offset().top;
    const statusBarElementHeight = $statusBar.outerHeight();
    let lastKnownScrollPosition = 0;
    let ticking = false;

    function checkStatusBarPosition() {
      lastKnownScrollPosition = $questionScreen.scrollTop();

      if (!ticking) {
        window.requestAnimationFrame(function () {
          const statusBarOffset = statusBarElementTop + statusBarElementHeight - ($questionScreen.outerHeight() + lastKnownScrollPosition);
          $statusBar.toggleClass('__sticky', statusBarOffset > 0);
          ticking = false;
        });
      }

      ticking = true;
    }

    $questionScreen.on('scroll', checkStatusBarPosition);
    checkStatusBarPosition();
// When you press Enter on comment form
    const commentForm = document.querySelector('.question-screen-content form');
    const commentInput = document.querySelector('.question-comments-form input');
    const formErrors = document.querySelector('.question-comments-form-errors');

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
          const savedComment = response.items[0];
          savedComment.body = commentText;

          document.querySelector('.question-comments-list').innerHTML += createCommentLayout(savedComment);

          // Clear input
          commentInput.value = '';
        });
    });

    // Expand form to start answering – init SimpleMDE
    commentForm.addEventListener('keydown', function (event) {
      if (event.shiftKey && event.which === 13) {
        event.preventDefault();

        const simpleMDE = new SimpleMDE({
          element: commentInput,
          autofocus: true,
          status: false,
          toolbarTips: false,
          toolbar: ['bold', 'italic', '|', 'link', 'quote', 'code', 'image', '|', 'ordered-list', 'unordered-list', 'heading', 'horizontal-rule'],
          placeholder: 'Your answer'
        });

        // Show answer buttons
        document.querySelector('.question-answer-buttons').style.display = 'block';

        // Unbind the handler
        this.removeEventListener('keydown', arguments.callee);

        // Scroll to form
        commentForm.scrollIntoView(true);

        // Posting answer
        document.querySelector('.button.post-answer').addEventListener('click', () => {
          const answerText = simpleMDE.value();

          // TODO make code blocks work on SO

          // answerText.replace(/```/g, '');

          // console.log(answerText.match('```\s\S(.*)\s\S```'));


          // return;

          stackexchange
            .fetch(`questions/${question.question_id}/answers/add`, null, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: encodeURI(`access_token=${token}&body=${answerText}&key=bdFSxniGkNbU3E*jsj*28w((&preview=false&site=stackoverflow&filter=!)s0G2lBkPFy_lEEcsfX9`)
            })
            .then(savedAnswer => {
              document.querySelector('.question-comments-list').innerHTML += createAnswerLayout(savedAnswer);
            })
        });
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
  $('.question-screen-content').empty();

  // Remove all event listeners
  $('.question-screen').off('scroll');
};
