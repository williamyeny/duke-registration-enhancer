var iframeContents;

console.log("enhancer loaded");

//get extension css url
var cssUrl = chrome.runtime.getURL("css/restyle.css");
console.log("css url: " + cssUrl);

$("iframe").on("load", function() {
  //inject css into iframe
  $(this).contents().find("head").append("<link rel='stylesheet' href='" + cssUrl + "'>'");
});

//Runs when the main registration window loads
$("#ptifrmtgtframe").on("load", function() {
  iframeContents = $("#ptifrmtgtframe").contents();
  var observer = new MutationObserver(function(mutations) {
    console.log("changed");
    /*
    We need to add the click listener with every iframe DOM change because the
    change removes the listener
    */
    dropDownAddClickListener();

  });
  observer.observe($(this).contents().find("body")[0], {childList: true, subtree: true});
});


//Runs when the inner dropdown buttons are clicked
function dropDownAddClickListener() {
  iframeContents.find("a[id*='DU_SEARCH_WRK_SSR_EXPAND_COLLAPS']").on("click", function(e) {
    //if it is in expanded form
    var buttonImage = $(this).children();
    if (buttonImage.attr("src") == "/cs/CSPRD01/cache/PS_COLLAPSE_ICN_1.gif") {
      console.log("courses section is expanded");
      e.preventDefault();
      var buttonId = $(this).attr("id");
      //just get number off of the end of the ID
      var buttonNumber = buttonId.replace("DU_SEARCH_WRK_SSR_EXPAND_COLLAPS$", "");
      console.log("buttonNumber: " + buttonNumber);
      /*
      delete the expanded courses section!
      (we are forced to use .parent() is because the tr's dont have ids!)
      */
      var coursesSection = iframeContents.find("#win0divGROUP_CAT\\$" + buttonNumber).parent().parent();
      //remove the spacing tr first
      console.log("HTML: " + coursesSection.next().html());
      coursesSection.next().remove();
      //remove the actual tr
      coursesSection.remove();

      //restore "expanded" button image
      buttonImage.attr("src", "/cs/CSPRD01/cache/PS_EXPAND_ICN_1.gif");

      //have height of subject section respond to change
      iframeContents.find("div[id*='win0divGB_SUBJECT']").parent().parent().children("td:first-child").attr("height","auto");
    }
  });
}


// var observer = new MutationObserver(function(mutations) {
//
//   mutations.forEach(function(mutation) {
//     //go through each element that was changed
//     mutation.addedNodes.forEach(function(node) {
//       if (node.nodeName == "HEAD") {
//         console.log("head");
//       }
//       console.log(node.nodeName);
//     });
//   });
// });
// var targetNode = $(document).contents().find("body")[0]; //checking for changes in iframe
// var observerConfig = {
//   childList: true, // detects if elements are added or removed
//   subtree: true //detects all elements in body, not just direct children
// };
// observer.observe(targetNode, observerConfig);
