var Db = chrome.extension.getBackgroundPage().Db;
var Settings = {
  $jiraUsername: document.querySelector("#jira-username"),
  $jiraPassword: document.querySelector("#jira-password"),

  showPage: function(){
    Settings.$jiraUsername.value = Db.get("jira-username");
    Settings.$jiraPassword.value = Db.get("jira-password");
  }
};

document.addEventListener('DOMContentLoaded', function (e) {
  Settings.showPage();
  Settings.$jiraUsername.addEventListener('blur', function (e) {
    chrome.runtime.sendMessage({type:"update-jira-username", value:Settings.$jiraUsername.value });
  });
  Settings.$jiraPassword.addEventListener('blur', function (e) {
    chrome.runtime.sendMessage({type:"update-jira-password", value:Settings.$jiraPassword.value });
  });
});
