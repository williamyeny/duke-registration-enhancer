/*
    Name: main.js
    Desc: Initializes extension and loads user options/settings.
*/

console.log("Duke Registration Enhancer running...");

var features;
var cache;

// how long a course lasts in cache before expiring
const cacheLifetime = 600000;
// const cacheLifetime = 20000;

// get extension settings
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
  },
  cache: {}
}, function (s) {
  console.log("Duke Registration Enhancer features loaded: ");

  // load features
  features = s.features;
  for (feature in features) {
    console.log("  " + features[feature].name + ": " + features[feature].enabled);
  }

  // update options in case default options are created
  chrome.storage.sync.set(s);

  // load local cache from cloud cache
  // cache = s.cache;
  cache = {};
  console.log("cache: " + JSON.stringify(cache));
  expireEntireCache(); // check for outdated entries

  // initialize
  injectCss();
  injectJs();
});

// removes ALL outdated course information
function expireEntireCache() {
  for (courseCode in cache) {
    for (badgeName in cache[courseCode]) {
      expireCacheEntry(courseCode, badgeName);
    }
  }
}

// removes specified course's information if outdated
function expireCacheEntry(courseCode, badgeName) {
  try {  
    if (cache[courseCode][badgeName].timestamp + cacheLifetime < Date.now()) {
      // remove entry
      delete cache[courseCode][badgeName]; 

      // check if course has no entries
      if (Object.keys(cache[courseCode]).length == 0) {
        delete cache[courseCode]; // delete entire course if empty
      }
      return true;
    }
  } catch(err) {
    console.log("courseCode not in cache");
  }
  return false;
}