const pages = document.querySelectorAll('head link[rel="import"]');
const importLinkTo = (link, element) => {
  let template = link.import.querySelector('.task-template');
  let clone = document.importNode(template.content, true);
  element.appendChild(clone);
};

// Import and add each page to the DOM
Array.prototype.forEach.call(pages, (link) => {
  importLinkTo(link, document.querySelector('.content'));
});

// Import and add question screen popup
const questionScreenLink = document.querySelector('.question-screen link[rel="import"]');
importLinkTo(questionScreenLink, document.querySelector('.question-screen'));


