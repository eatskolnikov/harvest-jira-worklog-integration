
var Db = {
  settings: {
    "jira-username": "",
    "jira-password": ""
  },
  loadSettings: function () {
    var k;
    for (k in Db.settings) {
      if (Db.settings.hasOwnProperty(k)) {
        Db.load(k, Db.settings[k]);
      }
    }
  },
  load: function (setting, defaultValue) {
    console.log(setting);
    console.log(defaultValue);
    var value = localStorage.getItem(setting);
    if (!!value) {
      value = defaultValue;
    }
    localStorage.setItem(setting, value);
    return value;
  },
  newMessage: function (request, sender, sendResponse) {
    console.log(request);
    if (request.type === 'update-jira-username') {
      Db.set("jira-username", request.value);
    } else if (request.type === 'update-jira-password') {
      Db.set("jira-password", request.value);
    }
  },
  get: function (setting) {
    var value = localStorage.getItem(setting);
    return value;
  },

  set: function (setting, value) {
    localStorage.setItem(setting, value);
  },
};

chrome.runtime.onMessage.addListener(Db.newMessage);
Db.loadSettings();
