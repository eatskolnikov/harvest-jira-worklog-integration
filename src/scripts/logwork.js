request = JSON.parse(request);
var username = request.jiraUsername;
var password = request.jiraPassword;
$.ajax(request.url, {
  beforeSend:function(request){
    request.setRequestHeader("X-Atlassian-Token", "no-check");
    request.setRequestHeader("Origin", request.domainUrl);
    request.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
  },
  data : JSON.stringify(request.data),
  contentType : "application/json",
  type : "POST"
})
.done(function() {
  var loggedSuccessfullyMessage = {
    type: 'logged-work-successfully',
    tabId: request.tabId
  };
  chrome.runtime.sendMessage({type:"focustab", tabId: request.originalTabId });
  chrome.runtime.sendMessage({type:"logworkresult", originalTabId:request.originalTabId, result: loggedSuccessfullyMessage });
})
.fail(function() {
  var failedSuccessfullyMessage = {
    type: "logged-work-failed",
    tabId: request.tabId
  };
  chrome.runtime.sendMessage({type:"focustab", tabId: request.originalTabId });
  chrome.runtime.sendMessage({type:"logworkresult", originalTabId:request.originalTabId, result:failedSuccessfullyMessage});
});
