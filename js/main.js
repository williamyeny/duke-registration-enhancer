console.log("enhancer loaded");

//get options
chrome.storage.sync.get({
  appearanceUpgrades: true, //default values
  instantCollapse: false
}, function(options) {
  console.log("options loaded: " + JSON.stringify(options));

  //sync options (in case default)
  chrome.storage.sync.set({
    appearanceUpgrades: options.appearanceUpgrades,
    instantCollapse: options.instantCollapse
  });

  //initialize
  if (options.appearanceUpgrades) injectCss();
  injectJs(options);
});