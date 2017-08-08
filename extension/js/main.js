/*
    Name: main.js
    Desc: Initializes extension and loads user options/settings.
*/

console.log("Duke Registration Enhancer running...");

//get options
chrome.storage.sync.get({  //default values
  features: {
    appearanceUpgrades: {
      name: "Appearance upgrades",
      value: true
    },
    instantCollapse: {
      name: "Instant course collapse",
      value: true
    },
    infoPreview: {
      name: "Info preview",
      value: true
    },
    rmpLink: {
      name: "RateMyProfessors link",
      value: true
    }
  }
}, function (options) {
  console.log("Duke Registration Enhancer features loaded: ");
  var features = options.features;
  for (feature in features) {
    console.log("  " + features[feature].name + ": " + features[feature].value);
  }

  //sync options
  chrome.storage.sync.set(options);

  //initialize
  if (features.appearanceUpgrades.value) injectCss();
  injectJs(features);
});