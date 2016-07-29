const _ = require('lodash');
const randomColor = require('randomcolor');

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

const savedColors = [];
exports.colorize = function (key) {
  const foundColor = _.find(savedColors, { key: key });

  if (foundColor) {
    return foundColor.color;
  } else {
    const color = randomColor({
      luminosity: 'random',
      hue: 'random'
    });

    savedColors.push({
      key: key,
      color: color
    });

    return color;
  }
};
