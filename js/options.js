// Saves options to chrome.storage.sync.
function save_options() {
  var appearanceUpgrades = document.getElementById('appearance-upgrades').checked;
  var instantCollapse = document.getElementById('instant-collapse').checked;
  chrome.storage.sync.set({
    appearanceUpgrades: appearanceUpgrades,
    instantCollapse: instantCollapse
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get(null, function(items) {
    document.getElementById('appearance-upgrades').checked = items.appearanceUpgrades;
    document.getElementById('instant-collapse').checked = items.instantCollapse;

    console.log(JSON.stringify(items));
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);