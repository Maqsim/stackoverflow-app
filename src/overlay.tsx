const bodyEl = document.body;
const containerEl = document.querySelector('#container');

window.Main.on('init-html', (html: string) => {
  containerEl?.classList.remove('prettyprinted', 'in');

  if (containerEl) {
    containerEl.textContent = html;

    requestAnimationFrame(() => {
      window.PR.prettyPrint();

      requestAnimationFrame(() => {
        bodyEl?.classList.add('in');
        containerEl?.classList.add('in');
      });
    });
  }
});

containerEl?.addEventListener('click', (e) => {
  e.stopPropagation();
});

// Closing overlay
// ===============

function closeOverlay() {
  bodyEl?.classList.remove('in');
  containerEl?.classList.remove('in');

  setTimeout(() => {
    if (containerEl) {
      containerEl.textContent = '';
    }

    setTimeout(() => {
      window.Main.hideOverlay();
    }, 50);
  }, 200);
}

document.addEventListener('click', closeOverlay);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeOverlay();
  }
});
