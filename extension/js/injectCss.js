/*
    Name: injectCss.js
    Desc: Injects CSS into the course registration embedded iframe for appearance changes.
*/

function injectCss() {
  //get extension css url
  var cssUrl = chrome.runtime.getURL("css/restyle.css");

  $("iframe").on("load", function () {
    //inject css into iframe
    $(this).contents().find("head").append("<link rel='stylesheet' href='" + cssUrl + "'>'");
  });
}
