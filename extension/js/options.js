/*
    Name: options.js
    Desc: Changes user options/settings (see: options.html)
*/

// Saves options to chrome.storage.sync.
function save_options() {
  var jsonString = "{"
  var inputs = document.getElementsByTagName("input");
  console.log(inputs);
  for (i = 0; i < inputs.length; i++) {
    jsonString += "\"" + inputs[i].id + "\": { \"name\": \"" + inputs[i].name + "\", \"value\": " + inputs[i].checked + "},";
  }
  jsonString = jsonString.slice(0, -1) + "}"; //remove comma and add closing bracket
  console.log(jsonString);


  chrome.storage.sync.set(JSON.parse(jsonString), function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 2000);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get(null, function(options) {
        
    //generate options HTML
    var optionsHtml;
    console.log(Object.keys(options).length);
    if (Object.keys(options).length) {
      optionsHtml = "";
      for (option in options) {
        optionsHtml += "<label><input type=\"checkbox\" id=\"" + option + "\" " + (options[option].value ? "checked" : "") +" name=\"" + options[option].name + "\">" + options[option].name +"</label><br>";
      }
    } else {
      optionsHtml = "Oops! No settings were found. Try opening DukeHub's registration page to generate them!";
      document.getElementById("save").outerHTML = ""; //delete save button
    }
    console.log(optionsHtml);
    document.getElementById("options").innerHTML = optionsHtml;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);