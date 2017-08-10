/*
    Name: options.js
    Desc: Changes user options/settings (see: options.html)
*/

// Saves options to chrome.storage.sync.
function save_options() {
  var features = {};
  var inputs = document.getElementsByClassName("feature");

  for (i = 0; i < inputs.length; i++) {
    var currentInput = inputs[i].firstChild;
    features[currentInput.id] = {
      name: currentInput.name,
      enabled: currentInput.checked
    }
  }

  var settings = document.getElementsByClassName("feature-setting");

  for (i = 0; i < settings.length; i++) {
    var currentSetting = settings[i].firstChild;
    var feature = currentSetting.getAttribute("feature");
    var settingName = currentSetting.name;
    var settingId = currentSetting.id;
    var settingChecked = currentSetting.checked;

    if (!("settings" in features[feature])) {
      features[feature].settings = {};
    }

    features[feature].settings[settingId] = {
      name: settingName,
      enabled: settingChecked
    }
  } 

  chrome.storage.sync.set({features:features}, function () {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function () {
      status.textContent = '';
    }, 2000);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get(null, function (options) {

    //generate HTML
    var featuresHtml;
    var features = options.features; console.log(JSON.stringify(features));
    if (Object.keys(options).length) {
      featuresHtml = "";
      for (feature in features) {
        // featuresHtml += "<label><input type='checkbox' class='feature' id='" + feature + "' " + (features[feature].value ? "checked" : "") + " name='" + features[feature].name + "'>" + features[feature].name + "</label><br>";
        featuresHtml += generateInputHtml(feature, features[feature].name, features[feature].enabled);
        
        if ("settings" in features[feature]) { // checks if feature has additional settings
          for (setting in features[feature].settings) {
            featuresHtml += generateInputHtml( setting, features[feature].settings[setting].name, features[feature].settings[setting].enabled, feature);
          }
        }
      }
    } else {
      featuresHtml = "Oops! No settings were found. Try opening DukeHub's registration page to generate them!";
      document.getElementById("save").outerHTML = ""; //delete save button
    }
    document.getElementById("options").innerHTML = featuresHtml;
  });
}

// generates the HTML of a setting, sorry for 1 liner lol
function generateInputHtml(id, name, checked, parentFeature = "") {
  return "<label class='feature" + (parentFeature ? "-setting" : "") +"'><input type='checkbox' " + (parentFeature ? "feature='" + parentFeature + "'" : "") + " id='" + id + "' " + (checked ? "checked" : "") + " name='" + name + "'>" + name + "</label><br>";
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
  save_options);