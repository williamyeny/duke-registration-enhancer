/*
    Name: main.js
    Desc: Initializes extension and loads user options/settings.
*/

console.log("Duke Registration Enhancer running...");

//get options
chrome.storage.sync.get({
  appearanceUpgrades: true, //default values
  instantCollapse: true,
  hoverPreview: true
}, function(options) {
  console.log("Duke Registration Enhancer options loaded: ");
  for (option in options) {
    console.log("  " + option + ": " + options[option]);
  }

  //sync options
  chrome.storage.sync.set(options);

  //initialize
  if (options.appearanceUpgrades) injectCss();
  injectJs(options);
});