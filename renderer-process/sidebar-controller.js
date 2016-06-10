const ipcRenderer = require('electron').ipcRenderer;

ipcRenderer.on('stackexchange:login', (event, data) => {
  fetch('https://api.stackexchange.com/2.2/me?order=desc&sort=reputation&site=stackoverflow&key=bdFSxniGkNbU3E*jsj*28w((&access_token=' + data.access_token).then((response) => {
    response.json().then((json) => {
      let profile = json.items[0];
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
        fetch('https://api.stackexchange.com/2.2/apps/' + data.access_token + '/de-authenticate?key=bdFSxniGkNbU3E*jsj*28w((').then((response) => {
          response.json().then((json) => {
            let isLogout = json.items.length;

            if (isLogout) {
              headerContainer.style.opacity = 0;
              headerContainer.style.height = 0;

              ipcRenderer.send('stackexchange:show-login-form');
            }
          });
        });
      });
    });
  });
});
