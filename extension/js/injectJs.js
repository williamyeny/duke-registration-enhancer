function injectJs(options) {
    //Runs when the main registration window loads
    $("#ptifrmtgtframe").on("load", function() {

        var defaultIframeDocument = $("#DU_SEARCH_SUBJECT");
        console.log("default: " + defaultIframeDocument);
        var observer = new MutationObserver(function(mutations) {
            console.log("changed");
            /*
            We need to add the click listener with every iframe DOM change because the
            change removes the listener
            */
            if (options.instantCollapse) dropDownAddClickListener(defaultIframeDocument);

        });
        observer.observe($(this).contents().find("body")[0], {childList: true, subtree: true});
    });
}