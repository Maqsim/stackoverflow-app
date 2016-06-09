require('electron').ipcRenderer.on('stackexchange:login', (event, data) => {
  fetch('https://api.stackexchange.com/2.2/me?order=desc&sort=reputation&site=stackoverflow&key=bdFSxniGkNbU3E*jsj*28w((&access_token=' + data.access_token).then(function (response) {
    response.json().then(function (data) {
      let profile = data.items[0];
      let headerElement = document.querySelector('.nav-header');

      headerElement.innerHTML = `
        <div class="nav-avatar">
          <img class="nav-avatar-img" src="${profile.profile_image}" alt="profile image"/>
        </div>
        <div class="nav-name">
          <div class="nav-title">${profile.display_name}</div>
          <div class="nav-rep">${profile.reputation} reputation</div>
        </div>
      `;

      headerElement.style.opacity = 1;
    });
  });
});
