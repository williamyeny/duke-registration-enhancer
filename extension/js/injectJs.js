/*
    Name: injectJs.js
    Desc: Runs Javascript files (features, listeners, etc.) when the embedded registration iframe loads.
          Important: despite also prefixed with "inject", this file interacts with the iframe from the parent dom once the iframe loads, 
          as opposed to injectCss.js, which directly injects CSS into the iframe.
*/

//when selecting elements in the registration page, you call iframeContents.find("query here") instead of $("query here")
var iframeContents;

function injectJs(features) {
    //load cache
    var cache = {};
    chrome.storage.sync.get("cache", function(c) {
        cache = c.cache;
    });

    //Runs when the main registration window loads
    $("#ptifrmtgtframe").on("load", function () {
        //get contents of the loaded frame
        iframeContents = $(this).contents();

        //when dom is changed...
        var observer = new MutationObserver(function (mutations) {
            /*
            We need to add the click listener with every iframe DOM change because the
            change removes the listener
            */
            dropDownClickListener(features, iframeContents);

            // add RateMyProfessors link
            if (features.rmpLink.value) rmpLink(mutations, iframeContents);

            // info preview
            if (features.infoPreview.value) infoPreview(mutations, iframeContents, cache);

        });
        observer.observe($(this).contents().find("body")[0], { childList: true, subtree: true }); //observe the body of the iframe when any elements are added
    });
}
