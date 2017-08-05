/*
    Name: options.js
    Desc: Changes user options/settings (see: options.html)
*/

// Saves options to chrome.storage.sync.
function save_options() {
  var jsonString = "{\"features\":{"
  var inputs = document.getElementsByTagName("input");
  console.log(inputs);
  for (i = 0; i < inputs.length; i++) {
    jsonString += "\"" + inputs[i].id + "\": { \"name\": \"" + inputs[i].name + "\", \"value\": " + inputs[i].checked + "},";
  }
  jsonString = jsonString.slice(0, -1) + "}}"; //remove comma and add closing brackets
  console.log(jsonString);


  chrome.storage.sync.set(JSON.parse(jsonString), function () {
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
    var features = options.features;
    if (Object.keys(options).length) {
      featuresHtml = "";
      for (feature in features) {
        featuresHtml += "<label><input type=\"checkbox\" id=\"" + feature + "\" " + (features[feature].value ? "checked" : "") + " name=\"" + features[feature].name + "\">" + features[feature].name + "</label><br>";
      }
    } else {
      featuresHtml = "Oops! No settings were found. Try opening DukeHub's registration page to generate them!";
      document.getElementById("save").outerHTML = ""; //delete save button
    }
    document.getElementById("options").innerHTML = featuresHtml;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
  save_options);