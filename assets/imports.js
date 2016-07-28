const pages = document.querySelectorAll('head link[rel="import"]');

function importLinkTo (link, element) {
  const template = link.import.querySelector('.task-template');
  const clone = document.importNode(template.content, true);
  element.appendChild(clone);
}

// Import pages
Array.prototype.forEach.call(pages, (link) => {
  importLinkTo(link, document.querySelector('.content'));
});

// Import question screen popup
const questionScreenLink = document.querySelector('.question-screen link[rel="import"]');
importLinkTo(questionScreenLink, document.querySelector('.question-screen'));
