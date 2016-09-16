var Db = chrome.extension.getBackgroundPage().Db;
HarvestJiraButton = {
  extractDomain: function (url) {
    var domain;
    if (url.indexOf("://") > -1) {
      domain = url.split('/')[2];
    } else {
      domain = url.split('/')[0];
    }
    domain = domain.replace("www.", "");
    domain = domain.split('/*')[0];
    domain = domain.split(':')[0];
    return {
      origins: [
        "*://" + domain + "/*"
      ]
    };
  },
  tabUpdated:function(tabId, changeInfo, tab) {
    var domain = HarvestJiraButton.extractDomain(tab.url),
      permission = {origins: domain.origins};
    if (changeInfo.status === "complete") {
      chrome.permissions.contains(permission, function (result) {
        if (result) {
          HarvestJiraButton.checkLoadedScripts(tabId, domain.file);
        }
      });
    }
  },
  checkLoadedScripts: function (tabId) {
    chrome.tabs.executeScript(tabId, {
      "code": "(typeof harvestJiraButton === 'undefined')"
    }, function (firstLoad) {
      if (!!firstLoad[0]) {
        chrome.tabs.insertCSS(tabId, {file: "styles/vendor/bootstrap.min.css"}, function(){
          chrome.tabs.insertCSS(tabId, {file: "styles/vendor/bootstrap-theme.min.css"}, function(){
            chrome.tabs.insertCSS(tabId, {file: "styles/style.css"});
          });
        });
        var _jiraUsername = Db.get("jira-username");
        var _jiraPassword = Db.get("jira-password");
        chrome.tabs.executeScript(tabId, {code: "var _jiraGlobalUsername='"+_jiraUsername+"', _jiraGlobalPassword='"+_jiraPassword+"'; "}, function(){
          chrome.tabs.executeScript(tabId, {file: "scripts/vendor/jquery.min.js"}, function () {
            chrome.tabs.executeScript(tabId, {file: "scripts/vendor/bootstrap.min.js"}, function () {
              chrome.tabs.executeScript(tabId, {file: "scripts/vendor/handlebars-v4.0.5.js"}, function () {
                chrome.tabs.executeScript(tabId, {file: "scripts/common.js"}, function () {
                  chrome.tabs.executeScript(tabId, {file: "scripts/content/Harvest.js"});
                });
              });
            });
          });
        });
      }
    });
  },
  newMessage: function (request, sender, sendResponse) {
    if (request.type === 'logwork') {
      chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        var currentTab = tabs[0];
        chrome.tabs.create({url:'https://'+request.domainUrl }, function(tab){
          request['tabId'] = tab.id;
          request['originalTabId'] = currentTab.id;
          request['jiraUsername'] = Db.get("jira-username");
          request['jiraPassword'] = Db.get("jira-password");
          chrome.tabs.executeScript(tab.id, { file: "scripts/vendor/jquery.min.js", runAt:"document_end"}, function () {
              chrome.tabs.executeScript(tab.id,{ code: "var request = '" + JSON.stringify(request) + "';" }, function() {
                chrome.tabs.executeScript(tab.id,{ file: "scripts/logwork.js" });
              });
          });
        });
      });
    }else if(request.type == "closetab") {
      chrome.tabs.remove(request.tabId);
    }else if(request.type == "focustab") {
      chrome.tabs.update(request.tabId, { active: true });
    }else if(request.type == "logworkresult"){
      chrome.tabs.sendMessage(request.originalTabId, request.result);
    }
  }
}

chrome.runtime.onMessage.addListener(HarvestJiraButton.newMessage);
chrome.tabs.onUpdated.addListener(HarvestJiraButton.tabUpdated);
