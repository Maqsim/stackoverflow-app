// This function is needed for performance
exports.asyncInnerHTML = (HTML, callback) => {
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
};
