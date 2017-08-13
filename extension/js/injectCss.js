/*
    Name: injectCss.js
    Desc: Injects CSS into the an embedded iframe for styling elements.
*/

function injectCss() {
  if (features.appearanceUpgrades.enabled) {
    addCssToHead("restyle.css", "iframe");
  }

  if (features.infoPreview.enabled) {
    addCssToHead("infoPreview.css", "#ptifrmtgtframe");
  }
}

function addCssToHead(fileName, frame) {
  //get extension css url
  var cssUrl = chrome.runtime.getURL("css/" + fileName);

  $(frame).on("load", function () {
    //inject css into iframe
    $(this).contents().find("head").append("<link rel='stylesheet' href='" + cssUrl + "'>'");
  });
}