// This function is needed for performance
exports.asyncInnerHTML = (HTML, callback) => {
  const temp = document.createElement('div');
  const fragment = document.createDocumentFragment();
  temp.innerHTML = HTML;

  (function () {
    if (temp.firstChild) {
      fragment.appendChild(temp.firstChild);
      setTimeout(arguments.callee, 0);
    } else {
      callback(fragment);
    }
  })();
};
