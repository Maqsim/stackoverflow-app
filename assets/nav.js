const storage = require('electron-json-storage');

// Register button click handlers to switch views
Array.prototype.forEach.call(document.querySelectorAll('.nav-button'), (button) => {
  button.addEventListener('click', (event) => {
    hideAllSectionsAndDeselectButtons();

    // Highlight clicked button and show view
    event.target.classList.add('is-selected');

    // Display the current section
    const sectionId = event.target.dataset.section + '-section';
    document.getElementById(sectionId).classList.add('is-shown');

    // Save currently active button in localStorage
    const buttonId = event.target.getAttribute('id');
    storage.set('activeSectionButtonId', buttonId, (err) => {
      if (err) {
        return console.error(err);
      }
    })
  });
});

// Always show Answer questions section first
document.querySelector('#answer-questions').click();

function hideAllSectionsAndDeselectButtons() {
  const sections = document.querySelectorAll('.js-section.is-shown');
  Array.prototype.forEach.call(sections, (section) => {
    section.classList.remove('is-shown');
  });

  const buttons = document.querySelectorAll('.nav-button.is-selected');
  Array.prototype.forEach.call(buttons, (button) => {
    button.classList.remove('is-selected');
  });
}
