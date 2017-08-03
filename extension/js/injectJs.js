function injectJs(options) {
    //Runs when the main registration window loads
    $("#ptifrmtgtframe").on("load", function() {

        var observer = new MutationObserver(function(mutations) {
            console.log("changed");
            /*
            We need to add the click listener with every iframe DOM change because the
            change removes the listener
            */
            dropDownAddClickListener(options);

        });
        observer.observe($(this).contents().find("body")[0], {childList: true, subtree: true});
    });
}

//Runs when the inner dropdown buttons are clicked
function dropDownAddClickListener(options) {
  var iframeContents = $("#ptifrmtgtframe").contents();
  iframeContents.find("a[id*='DU_SEARCH_WRK_SSR_EXPAND_COLLAPS']").on("click", function(e) {
    if (options.instantCollapse) instantCollapse(this, iframeContents, e);
  });
}