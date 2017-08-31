/*
    Name: optionsButton.js
    Desc: Adds a button to the registration page, allowing easier access to the options page
*/

function optionsButton() {
  var optionsUrl = chrome.runtime.getURL("options.html");
  var style="padding:3px 10px; color:white; text-decoration:none; background-color:grey; border-radius:3px; position:fixed; right: 20px; bottom: 5px";

  var optionsButtonHtml = "<a href='" + optionsUrl + "' style='" + style + "' target='_blank'>DRE Settings</a>";

  $("body").append(optionsButtonHtml);
}