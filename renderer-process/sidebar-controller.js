const ipcRenderer = require('electron').ipcRenderer;
const pinnedQuestions = require('./pinned-questions-service');
const stackexchange = require('./stackexchange-api-service');

ipcRenderer.on('stackexchange:login', (event, data) => {
  localStorage.token = data.token;
});

function init(profile) {
  const headerElement = document.querySelector('.nav-header-content');
  localStorage.userId = profile.user_id;
  localStorage.accountId = profile.account_id;

  headerElement.innerHTML = `
        <div class="nav-avatar">
          <img class="nav-avatar-img" src="${profile.profile_image}" alt="profile image"/>
        </div>
        <div class="nav-name">
          <div class="nav-title">
            ${profile.display_name}
            <span class="nav-logout">&nbsp;<i class="fa fa-sign-out" aria-hidden="true"></i></span>
          </div>
          <div class="nav-rep">${profile.reputation} reputation</div>
        </div>
      `;

  // Register event handler on Logout click
  document.querySelector('.nav-logout').addEventListener('click', () => {
    stackexchange.logout(localStorage.token).then(() => {
      delete localStorage.profile;
      delete localStorage.token;

      ipcRenderer.send('stackexchange:show-login-form');
    });
  });

  // Listen reputation change via sockets
  stackexchange.socketClient.on(`1-${profile.user_id}-reputation`, data => {
    // Update reputation counter
    document.querySelector('.nav-rep').innerHTML = `${data} reputation`;

    // Show notification
    new Notification('Reputation earned!', {
      title: 'Reputation earned!',
      body: `You reputation now is ${data}`
    });
  });

  stackexchange.socketClient.on(`1-${profile.user_id}-topbar`, data => {
    // TODO
  });
}

const cachedProfile = localStorage.profile && JSON.parse(localStorage.profile);

if (cachedProfile) {
  init(cachedProfile);
} else {
  ipcRenderer.on('stackexchange:login', (event, data) => {
    // Load info about logged in user
    stackexchange.fetch('me', { access_token: data.token }).then(response => {
      const profile = response.items[0];
      localStorage.profile = JSON.stringify(profile);

      init(profile, true);
    });
  });
}

// Update pinned questions menu item
pinnedQuestions.updateMenuItem();
