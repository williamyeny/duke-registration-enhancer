/*
    Name: main.js
    Desc: Initializes extension and loads user options/settings.
*/

console.log("Duke Registration Enhancer running...");

//get options
chrome.storage.sync.get({
  appearanceUpgrades: { //default values
    name: "Appearance upgrades",
    value: true
  }, 
  instantCollapse: {
    name: "Instant course collapse",
    value: true
  },
  infoPreview: {
    name: "[Experimental] Info preview",
    value: false
  },
  rmpLink: {
    name: "RateMyProfessors link",
    value: true
  },
}, function(options) {
  console.log("Duke Registration Enhancer options loaded: ");
  for (option in options) {
    console.log("  " + options[option].name + ": " + options[option].value);
  }

  //sync options
  chrome.storage.sync.set(options);

  //initialize
  if (options.appearanceUpgrades.value) injectCss();
  injectJs(options);
});