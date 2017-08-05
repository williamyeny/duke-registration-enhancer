/*
    Name: dropDownClickListener.js
    Desc: Detects when a course dropdown button is clicked.
*/

//when selecting elements in the registration page, you call iframeContents.find("query here") instead of $("query here")
var iframeContents;

function dropDownClickListener(options, ifc) {
  iframeContents = ifc;

  //on expand/collapse dropdown button click
  iframeContents.find("a[id*='DU_SEARCH_WRK_SSR_EXPAND_COLLAPS']").on("click", function(e) {
    var button = this;

    //run instantCollapse feature (js/instantCollapse.js)
    if (options.instantCollapse.value) instantCollapse(button, iframeContents, e);

  });
}