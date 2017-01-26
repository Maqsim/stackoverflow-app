const ipcRenderer = require('electron').ipcRenderer;
const $ = require('jquery');
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
            <span class="nav-logout">&nbsp;<i class="fa fa-sign-out"></i></span>
          </div>
          <div class="nav-rep">
            ${profile.reputation} rep
          </div>
        </div>
        <div class="nav-notifications">
          <span class="nav-rep-new">10</span>
          <span class="nav-inbox">2</span>
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
    const notificationRep = parseInt($('.nav-rep-new').text()) || 0;
    const oldRep = parseInt($('.nav-rep').text()) || 0;
    const newRep = data;
    const diff = newRep - oldRep;

    // Update reputation counter
    $('.nav-rep').text(newRep);

    // Show notification
    new Notification('Reputation', {
      title: 'Reputation',
      body: `You earned ${diff} reputation`
    });

    $('.nav-rep-new').show().text(notificationRep + diff + ' rep');
  });

  // Listen for new comments
  stackexchange.socketClient.on(`${profile.account_id}-topbar`, data => {
    // TODO New comment
    const notificationInboxCount = parseInt($('.nav-inbox').text()) || 0;

    // Show notification
    new Notification('Comment', {
      title: 'Comment',
      body: `You have new comment`
    });

    $('.nav-inbox').show().text(notificationInboxCount + 1);
  });

  // Get unread inbox and achievements
  stackexchange.fetch('me/inbox', { access_token: localStorage.token }).then(response => {
    // console.log(response);
  });

  stackexchange.fetch('me/reputation-history/full', { access_token: localStorage.token }).then(response => {
    // console.log(response);
  });
}

const cachedProfile = localStorage.profile && JSON.parse(localStorage.profile);

if (cachedProfile) {
  init(cachedProfile);
} else {
  // Load info about logged in user
  stackexchange.fetch('me', { access_token: localStorage.token }).then(response => {
    const profile = response.items[0];
    localStorage.profile = JSON.stringify(profile);

    init(profile, true);
  });
}

// Update pinned questions menu item
pinnedQuestions.updateMenuItem();
