const moment = require('moment');
const delegate = require('delegate');
const SimpleMDE = require('simplemde');
const stackexchange = require('./stackexchange-api-service');
const pinnedQuestions = require('./pinned-questions-service');
const { asyncInnerHTML, colorize } = require('./utils');
const $ = require('jquery');
const { map, find } = require('lodash');
const loggedInUserId = Number(localStorage.userId);
const loggedInAccountId = Number(localStorage.accountId);
let questionId;

function createCommentLayout(comment) {
  const timeAgo = moment(comment.creation_date * 1000).fromNow();

  return `
    <div class="question-comments-list-item ${loggedInUserId === comment.owner.user_id ? '__my' : ''}" data-id="${comment.comment_id}">
      <nobr class="question-comments-profile-link">
        <span class="question-comments-profile-color" style="background: ${colorize(comment.owner.user_id)}"></span>
        <a href="${comment.owner.link}">${comment.owner.display_name}</a>
      </nobr>
      <span class="question-comments-list-item-body">
        ${comment.body}
        <span class="text-muted">${timeAgo}</span>
        <span class="question-comments-controls">
          &nbsp;
          <a class="question-comments-controls-edit" href="#">edit</a>
          <span class="text-muted">·</span>
          <a class="question-comments-controls-remove" href="#">remove</a>
        </span>
      </span>
    </div>
  `;
}

// TODO make answers look more sick and figure out how to show comments to the answers
function createAnswerLayout(answer) {
  const timeAgo = moment(answer.creation_date * 1000).fromNow();

  return `
    <div class="question-comments-list-item question-answer ${loggedInUserId === answer.owner.user_id ? '__my' : ''} ${answer.is_accepted && '__accepted'}" data-id="${answer.answer_id}">
      <div class="question-comments-profile-link">
        <img class="question-answer-profile-image" src="${answer.owner.profile_image}" alt="">
        <b>${answer.owner.display_name}</b> <span class="text-muted">${timeAgo}</span>
      </div>
      <div class="question-answer-body">${answer.body}</div>
      <div class="question-comments-controls">
        &nbsp;
        <a class="question-comments-controls-edit" href="#">edit</a>
        <span class="text-muted">·</span>
        <a class="question-comments-controls-remove" href="#">remove</a>
      </div>
    </div>
  `;
}

function updateScore(score) {
  $('.question-status-bar-action.like .like-count').html(score || '');
}

exports.renderQuestion = (question, token) => {
  questionId = question.question_id;
  const questionUpdates = []; // Updates coming from socket server
  const questionScreenElement = document.querySelector('.question-screen');

  function loadAndRenderComment(commentId) {
    stackexchange
      .fetch(`comments/${commentId}`, { filter: '!*Ju*loZ-vYZpgswx' })
      .then(response => {
        const comment = response.items[0];
        question.comments = question.comments || [];
        question.comments.push(comment);
        document.querySelector('.question-comments-list').innerHTML += createCommentLayout(comment);
      });
  }

  const timeAgo = moment(question.creation_date * 1000).fromNow();
  const dateTime = moment(question.creation_date * 1000).format('LLLL');
  const html =  `
    <div class="text-muted" style="margin-top: 15px;">
      <span title="${dateTime}">${timeAgo} &nbsp; <i class="fa fa-eye"></i> ${question.view_count}</span>
    </div>
  ` + question.body;

  asyncInnerHTML(question.body, (questionBodyHtml) => {
    questionScreenElement.innerHTML = `
      <div class="question-screen-content">
        <div class="text-muted" style="margin-top: 15px;">
          <span title="${dateTime}">${timeAgo} &nbsp; <i class="fa fa-eye"></i> ${question.view_count}</span>
        </div>
        <div class="question-title">${question.title}</div>
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
        <div class="question-status-bar ${question.answer_count & !question.accepted_answer_id && '__answered'} ${question.accepted_answer_id && '__accepted'}">
          <div class="question-status-bar-content">
            <a class="question-status-bar-action scroll-to-comments" href="#scroll-to-comments">${scrollToCommentsTitle}</a>
            <a class="question-status-bar-action update"><i class="fa fa-refresh"></i></a>
            <a class="question-status-bar-action pin"><i class="fa fa-thumb-tack ${!pinnedQuestions.isPinned(question) ? 'rotate-45' : ''}"></i></a>
            <a class="question-status-bar-action" href="${question.link}" title="Open in browser"><i class="fa fa-external-link"></i></a>
            <a class="question-status-bar-action" title="Create and paste JSFiddle"><i class="fa fa-jsfiddle"></i></a>
            <a class="question-status-bar-action like ${question.upvoted ? '__liked' : ''}"><i class="fa fa-heart"></i> <span class="like-count">${question.score || ''}</span></a>
            
            <!--<a class="question-status-bar-action __right"><i class="fa fa-flag"></i></a>-->
            <a class="question-status-bar-action __right" href="${question.owner.link}">
              <img class="question-status-bar-profile-image" src="${question.owner.profile_image}" alt="">
              ${question.owner.display_name}
            </a>
          </div>
          <div class="question-status-bar-tip">
            Choose comment you want to reply and <b>hit Enter</b> or <b>Esc</b> to cancel.
          </div>
        </div>
        <div class="question-status-bar-placeholder"></div>
        <div class="question-comments-list"></div>
        
        <!-- TODO -->
        <form class="question-comments-form" style="margin-bottom: 22px; margin-top: 8px;">
          <button class="button question-comments-add-comment" class="button">Add comment...</button>
          <input type="text" style="width: 100%;" hidden placeholder="Your comment">
          <div class="question-comments-form-errors"></div>
        </form>
        
        <div class="question-answer-list">
          
        </div>
        
        <form class="question-comments-form">
          <textarea></textarea>
          <div class="question-answer-buttons">
            <button type="button" class="button __success post-answer">Post your answer</button>
          </div>
        </form>
      </div>
    `;

    $('.question-comments-add-comment').click(function () {
      $(this).hide().next().show();
    });

    $('.question-status-bar-action.scroll-to-comments').click(function () {
      setTimeout(function () {
        commentInput.focus();
      }, 0);
    });

    $('.question-status-bar-action.pin').click(function () {
      if (pinnedQuestions.isPinned(question)) {
        $('.fa', this).addClass('rotate-45');
        pinnedQuestions.unpin(question);
      } else {
        $('.fa', this).removeClass('rotate-45');
        pinnedQuestions.pin(question);
      }

      pinnedQuestions.updateMenuItem();
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
      .then(response => {
        question.comments = response.items;
        document.querySelector('.question-comments-list').innerHTML = question.comments.map(createCommentLayout).join('');
      });

    // Load and render answers
    stackexchange
      .fetch(`questions/${question.question_id}/answers`, {
        order: 'desc',
        sort: 'votes',
        filter: '!7gohYEfTZz2-egqfSOhb)AcNr1qh1NkP71',
        access_token: token
      })
      .then(response => {
        question.answers = response.items;

        const acceptedAnswer = find(question.answers, 'is_accepted');

        if (acceptedAnswer) {
          question.moreAnswerCount = question.answers.length;
          document.querySelector('.question-answer-list').innerHTML += createAnswerLayout(acceptedAnswer);
        } else {
          document.querySelector('.question-answer-list').innerHTML += question.answers.map(createAnswerLayout).join('');
        }
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

    // Init answer form
    const simpleMDE = new SimpleMDE({
      status: false,
      toolbarTips: false,
      toolbar: ['bold', 'italic', '|', 'link', 'quote', 'code', 'image', '|', 'ordered-list', 'unordered-list', 'heading', 'horizontal-rule'],
      placeholder: 'Your answer'
    });

    // Posting answer
    document.querySelector('.button.post-answer').addEventListener('click', () => {
      let doAddSpaces = false;
      let answerText = simpleMDE.value();

      // Change code-block format so SO can handle it
      answerText = answerText
        .split('\n')
        .map(line => {
          if (line === '```') {
            doAddSpaces = !doAddSpaces;
            return ''; // Remove this line
          }

          return doAddSpaces ? '    ' + line : line;
        })
        .join('\n');

      stackexchange
        .post(`questions/${question.question_id}/answers/add`, {
          access_token: token,
          body: answerText,
          key: 'bdFSxniGkNbU3E*jsj*28w((',
          preview: false,
          site: 'stackoverflow',
          filter: '!)s0G2lBkPFy_lEEcsfX9'
        })
        .then(response => {
          // Server-side validation (if not pass)
          if (response.error_id) {
            return formErrors.innerHTML = response.error_message;
          }

          // Render successfully added comment
          const savedAnswer = response.items[0];

          document.querySelector('.question-comments-list').innerHTML += createAnswerLayout(savedAnswer);
        })
    });

    let mentionsShown = false;
    let mentionData = [];

    function hideMentions() {
      mentionsShown = false;
      $('.question-status-bar').removeClass('__show-tip');
      $('.question-comments-list').removeClass('__show-mentions');
      $('.question-comments-list-item.__highlighted').removeClass('__highlighted');

      const caretPosition = commentInput.value.slice(0, commentInput.selectionStart).length;

      if (commentInput.value.substr(caretPosition - 1, 1) === '@'){
        commentInput.value = commentInput.value.slice(0, caretPosition - 1) + commentInput.value.slice(caretPosition);
      }
    }

    commentInput.addEventListener('keydown', function (event) {
      if (mentionsShown && event.shiftKey && event.which === 50) {
        event.preventDefault();
      }

      // Show mentions on '@'
      if (event.shiftKey && event.which === 50) {
        // Update mention data on each show
        mentionData = map(question.comments, 'owner.user_id');

        if (mentionData.length) {
          mentionsShown = true;
          $('.question-status-bar').addClass('__show-tip');
          $('.question-comments-list')
            .addClass('__show-mentions')
            .find('.question-comments-list-item:not(.__my):last')
            .addClass('__highlighted');
        }
      }

      // Hide mentions on Esc
      if (mentionsShown && event.which === 27) {
        hideMentions()
      }

      // Switch between mentions on Tab
      if (mentionsShown && event.which === 9) {
        event.preventDefault();

        $('.question-comments-list-item.__highlighted')
          [event.shiftKey ? 'nextAll' : 'prevAll'](':not(.__my):first')
          .addClass('__highlighted')
          .siblings()
          .removeClass('__highlighted');
      }

      // Choose mention on Enter
      if (mentionsShown && event.which === 13) {
        event.preventDefault();

        // TODO
        console.log($('.question-comments-list-item.__highlighted'));
        hideMentions();
      }
    });

    commentInput.addEventListener('blur', function () {
      if (mentionsShown) {
        hideMentions();
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
        case 'accept':
          $statusBar.addClass('__accepted');
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
