// TODO Add styles from root css

class ProfileCard extends HTMLElement {
  // Use createdCallback instead of constructor to init an element.
  createdCallback() {
    // This element uses Shadow DOM.
    this.createShadowRoot().innerHTML = `
      <div class="nav-logo">
        <svg class="nav-header-icon"><use xlink:href="assets/img/icons.svg#icon-electron"></use></svg>
      </div>
      <div class="nav-name">
        <div class="nav-title">Max</div>
        <div class="nav-rep">999 reputation</div>
      </div>
    `;
  }
}

document.registerElement('profile-card', ProfileCard);
