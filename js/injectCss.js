function injectCss() {
  //get extension css url
  var cssUrl = chrome.runtime.getURL("css/restyle.css");
  console.log("css url: " + cssUrl);

  $("iframe").on("load", function() {
    //inject css into iframe
    $(this).contents().find("head").append("<link rel='stylesheet' href='" + cssUrl + "'>'");
  });
}
