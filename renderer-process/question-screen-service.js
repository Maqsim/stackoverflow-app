function asyncInnerHTML(HTML, callback) {
  let temp = document.createElement('div');
  let frag = document.createDocumentFragment();
  temp.innerHTML = HTML;

  (function () {
    if (temp.firstChild) {
      frag.appendChild(temp.firstChild);
      setTimeout(arguments.callee, 0);
    } else {
      callback(frag);
    }
  })();
}

exports.renderQuestion = (question) => {
  asyncInnerHTML(question.body, (questionBodyHtml) => {
    document.querySelector('.question-screen-content').innerHTML = `
      <div class="question-title">${question.title}</div>
    `;

    document.querySelector('.question-screen-content').appendChild(questionBodyHtml);

    const codeBlocks = document.querySelectorAll('pre code');
    Array.prototype.forEach.call(codeBlocks, (code) => {
      code.classList.add('prettyprint');
    });

    prettyPrint();
  });
};

exports.clearScreen = () => {
  document.querySelector('.question-screen-content').innerHTML = '';
};
