const moment = require('moment');
const delegate = require('delegate');
const SimpleMDE = require('simplemde');
const stackexchange = require('./stackexchange-api-service');
const pinnedQuestions = require('./pinned-questions-service');
const { asyncInnerHTML, colorize } = require('./utils');
const $ = require('jquery');
const loggedInUserId = Number(localStorage.userId);
const loggedInAccountId = Number(localStorage.accountId);
let questionId;

function createCommentLayout(comment) {
  const timeAgo = moment(comment.creation_date * 1000).fromNow();

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

function updateScore(score) {
  $('.question-status-bar-action.like .like-count').html(score || '');
}

function loadAndRenderComment(commentId) {
  stackexchange
    .fetch(`comments/${commentId}`, { filter: '!*Ju*loZ-vYZpgswx' })
    .then((response) => {
      document.querySelector('.question-comments-list').innerHTML += createCommentLayout(response.items[0]);
    });
}

exports.renderQuestion = (question, token) => {
  questionId = question.question_id;
  const questionUpdates = []; // Updates coming from socket server
  const questionScreenElement = document.querySelector('.question-screen');

  asyncInnerHTML(question.body, (questionBodyHtml) => {
    questionScreenElement.innerHTML = `
      <div class="question-screen-content">
        <div class="question-title"><a href="${question.link}">${question.title}</a></div>
      </div>
    `;

    const questionScreenContentElement = document.querySelector('.question-screen-content');
    questionScreenContentElement.appendChild(questionBodyHtml);

    // Beautify code
    const codeBlocks = document.querySelectorAll('pre code');
    Array.prototype.forEach.call(codeBlocks, (code) => {
      code.classList.add('prettyprint');
    });

    prettyPrint();

    const answerCountString = question.answer_count ? `${question.answer_count} <i class="fa fa-check-circle"></i>&nbsp;` : '';
    const commentCountString = question.comment_count ? `${question.comment_count} <i class="fa fa-comments-o"></i>` : '';
    let scrollToCommentsTitle = (answerCountString + ' ' + commentCountString).trim();
    scrollToCommentsTitle = scrollToCommentsTitle || 'Add your comment...';

    questionScreenElement.innerHTML += `
      <div class="question-comments" id="scroll-to-comments">
        <div class="question-status-bar">
          <a class="question-status-bar-action" href="#scroll-to-comments">${scrollToCommentsTitle}</a>
          <a class="question-status-bar-action update"><i class="fa fa-refresh"></i></a>
          <a class="question-status-bar-action pin"><i class="fa fa-thumb-tack ${!pinnedQuestions.isPinned(question) ? 'rotate-45' : ''}"></i></i></a>
          <a class="question-status-bar-action"><i class="fa fa-jsfiddle"></i></a>
          <a class="question-status-bar-action like ${question.upvoted ? '__liked' : ''}"><i class="fa fa-heart"></i> <span class="like-count">${question.score || ''}</span></a>
          
          <a class="question-status-bar-action __right" href="${question.owner.link}">
            <img class="question-status-bar-profile-image" src="${question.owner.profile_image}" alt="">
            ${question.owner.display_name}
          </a>
        </div>
        <div class="question-status-bar-placeholder"></div>
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

    $('.question-status-bar-action.pin').click(function () {
      if (pinnedQuestions.isPinned(question)) {
        $('.fa', this).addClass('rotate-45');
        pinnedQuestions.unpin(question);
      } else {
        $('.fa', this).removeClass('rotate-45');
        pinnedQuestions.pin(question);
      }
    });

    $('.question-status-bar-action.update').click(function () {
      $('.fa', this).toggleClass('__spin');
    });

    $('.question-status-bar-action.like').click(function () {
      const $this = $(this);
      const undoUpvote = $this.hasClass('__liked');

      if (undoUpvote) {
        updateScore(--question.score);
        $this.removeClass('__liked');
      } else {
        updateScore(++question.score);
        $this.addClass('__liked');
      }

      // Save to server
      stackexchange
        .fetch(`questions/${question.question_id}/upvote${undoUpvote ? '/undo' : ''}`, null, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: encodeURI(`access_token=${token}&key=bdFSxniGkNbU3E*jsj*28w((&preview=false&site=stackoverflow`)
        });
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
      });

    // Make status bar sticky
    const $questionScreen = $('.question-screen');
    const $statusBar = $('.question-status-bar');
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
    const commentForm = document.querySelector('.question-comments-form');
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

    stackexchange.socketClient.on(`1-question-${question.question_id}`, data => {
      switch (data.a) {
        case 'score':
          updateScore(data.score);
          break;
        case 'comment-add':
          if (data.acctid !== loggedInAccountId) {
            loadAndRenderComment(data.commentid);
          }
          break;
        default:
          if (data.a === 'post-edit') {
            questionScreenContentElement.classList.add('__outdated');
          }

          questionUpdates.push(data);
          $('.question-status-bar-action.update').addClass('__new');
      }
    });
  });
};

exports.clearScreen = () => {
  // Remove all event listeners
  $('.question-screen').empty().off('scroll');
  stackexchange.socketClient.off(`1-question-${questionId}`);
};
