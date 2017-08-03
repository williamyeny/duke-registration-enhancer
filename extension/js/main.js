/*
    Name: main.js
    Desc: Initializes extension and loads user options/settings.
*/

console.log("Duke Registration Enhancer running...");

//get options
chrome.storage.sync.get({
  appearanceUpgrades: true, //default values
  instantCollapse: false,
  hoverPreview: true
}, function(options) {
  console.log("options loaded: " + JSON.stringify(options));

  //sync options
  chrome.storage.sync.set(options);

  //initialize
  if (options.appearanceUpgrades) injectCss();
  injectJs(options);
});