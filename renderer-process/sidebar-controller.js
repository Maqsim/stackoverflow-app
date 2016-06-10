const ipcRenderer = require('electron').ipcRenderer;
const stackexchange = require('./stackexchange-api');

ipcRenderer.on('stackexchange:login', (event, data) => {
  stackexchange.fetch('me', { access_token: data.token }).then((response) => {
    let profile = response.items[0];
    let headerElement = document.querySelector('.nav-header-content');
    let headerContainer = headerElement.parentNode;

    headerElement.innerHTML = `
        <div class="nav-avatar">
          <img class="nav-avatar-img" src="${profile.profile_image}" alt="profile image"/>
        </div>
        <div class="nav-name">
          <div class="nav-title">${profile.display_name}</div>
          <div class="nav-rep">${profile.reputation} reputation</div>
        </div>
        <div class="nav-logout">
          <img src="assets/icons/logout.svg" alt=""/>
        </div>
      `;

    headerContainer.style.opacity = 1;
    headerContainer.style.height = '87px';

    // Register event handler on Logout click
    document.querySelector('.nav-logout').addEventListener('click', () => {
      stackexchange.logout(data.token).then(() => {
        headerContainer.style.opacity = 0;
        headerContainer.style.height = 0;

        ipcRenderer.send('stackexchange:show-login-form');
      });
    });
  });
});
