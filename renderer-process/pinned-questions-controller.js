const moment = require('moment');
const ipcRenderer = require('electron').ipcRenderer;
const stackexchange = require('./stackexchange-api-service');
const questionScreenService = require('./question-screen-service');
const Vue = require('vue');

new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue.js!'
  }
})
