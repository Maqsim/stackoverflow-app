const bodyEl = document.body;
const codePreviewEl = document.querySelector('#code-preview') as HTMLPreElement;
const imagePreviewEl = document.querySelector('#image-preview') as HTMLDivElement;
let imageEl: HTMLImageElement;

let isMoveable = false;
let scale = 1;
let translateX = 0;
let translateY = 0;

function onZoom(event: WheelEvent) {
  scale += event.deltaY * -0.01;
  scale = Math.min(Math.max(0.125, scale), 4);
  applyTransform();
}

function onMove(event: MouseEvent) {
  if (!isMoveable) {
    return;
  }

  translateX += event.movementX;
  translateY += event.movementY;

  applyTransform();
}

window.Main.on('init-html', (html: string) => {
  // Reset code preview state
  imagePreviewEl.hidden = true;
  codePreviewEl.hidden = false;

  requestAnimationFrame(() => {
    codePreviewEl.classList.remove('prettyprinted', 'in');
    codePreviewEl.classList.add('in');
    bodyEl.classList.add('in');
  });

  codePreviewEl.textContent = html;

  requestAnimationFrame(() => {
    window.PR.prettyPrint();
  });
});

window.Main.on('init-image', (url: string) => {
  // Reset image preview state
  scale = 1;
  translateX = 0;
  translateY = 0;
  codePreviewEl.hidden = true;
  imagePreviewEl.hidden = false;

  requestAnimationFrame(() => {
    imagePreviewEl.classList.add('in');
    bodyEl.classList.add('in');
  });

  imageEl = document.createElement('img');
  imageEl.src = url;
  imageEl.style.maxHeight = '100vh';
  imagePreviewEl.appendChild(imageEl);
  bodyEl.addEventListener('wheel', onZoom);

  imageEl.addEventListener('mousedown', (event) => {
    event.preventDefault();

    isMoveable = true;
  });

  bodyEl.addEventListener('mousemove', onMove);

  imageEl.addEventListener('mouseup', (event) => {
    event.preventDefault();

    isMoveable = false;
  });

  imageEl.addEventListener('click', (event) => {
    event.stopPropagation();
  });
});

// Closing overlay
// ===============

function closeOverlay() {
  bodyEl.classList.remove('in');
  codePreviewEl.classList.remove('in');
  imagePreviewEl.classList.remove('in');

  bodyEl.removeEventListener('wheel', onZoom);
  bodyEl.removeEventListener('mousemove', onMove);

  setTimeout(() => {
    codePreviewEl.textContent = '';
    imagePreviewEl.textContent = '';
    imagePreviewEl.hidden = false;
    codePreviewEl.hidden = false;

    setTimeout(() => {
      window.Main.hideOverlay();
    }, 50);
  }, 200);
}

codePreviewEl.addEventListener('click', (e) => {
  e.stopPropagation();
});

document.addEventListener('click', closeOverlay);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeOverlay();
  }
});

function applyTransform() {
  imageEl.style.transform = `
    scale3d(${scale}, ${scale}, 1)
    translate3d(${translateX / scale}px, ${translateY / scale}px, 0)
  `;
}
