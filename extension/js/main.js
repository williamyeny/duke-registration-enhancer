/*
    Name: main.js
    Desc: Initializes extension and loads user options/settings.
*/

console.log("Duke Registration Enhancer running...");

//get extension settings
chrome.storage.sync.get({  //default values
  features: {
    appearanceUpgrades: {
      name: "Appearance upgrades",
      description: "Makes the registration page look neater and more modern.",
      enabled: true
    },
    instantCollapse: {
      name: "Instant course collapse",
      description: "Instantly collapses courses when clicking the dropdown button",
      enabled: true
    },
    infoPreview: {
      name: "Info preview",
      enabled: true,
      description: "Preview information about courses at a glance!",
      settings: {
        clickView: {
          name: "Click instead of hover",
          enabled: false
        },
        showOldNumber: {
          name: "Show old course numbers in preview",
          enabled: false
        }
      }
    },
    rmpLink: {
      name: "RateMyProfessors link",
      description: "Links to professor's potentially available RateMyProfessors profile.",
      enabled: true
    }
  }
}, function (extensionSettings) {
  console.log("Duke Registration Enhancer features loaded: ");
  var features = extensionSettings.features;
  for (feature in features) {
    console.log("  " + features[feature].name + ": " + features[feature].enabled);
  }

  //sync extensionSettings
  chrome.storage.sync.set(extensionSettings);

  //initialize
  if (features.appearanceUpgrades.enabled) injectCss();
  injectJs(features);
});