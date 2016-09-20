harvestJiraButton.render(".entry-button:not(.harvest-jira)", function(element) {
  var jiraTaskAnchor = _(".external-link", element.parentNode);
  var harvestTimeSpentNode = _(".entry-time", element.parentNode);
  if(typeof(jiraTaskAnchor) !== 'undefined' && (jiraTaskAnchor !== null)) {
    var jiraTaskUrl = jiraTaskAnchor.getAttribute("href");
    var jiraTaskTitle = $(jiraTaskAnchor).text();
    var harvestTimeSpent = $(harvestTimeSpentNode).text();
    button = harvestJiraButton.createButton({
      jiraTaskUrl:jiraTaskUrl,
      jiraTaskTitle: jiraTaskTitle,
      harvestTimeSpent: harvestTimeSpent
    });
    element.appendChild(button);
  }
});
