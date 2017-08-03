/*
    Name: injectJs.js
    Desc: Injects Javascript files (features, listeners, etc.) into the course registration embedded iframe.
*/

//when selecting elements in the registration page, you call iframeContents.find("query here") instead of $("query here")
var iframeContents;

function injectJs(options) {
    //Runs when the main registration window loads
    $("#ptifrmtgtframe").on("load", function() {
        //get contents of the loaded frame
        iframeContents = $(this).contents();

        //when dom is changed...
        var observer = new MutationObserver(function(mutations) {
            /*
            We need to add the click listener with every iframe DOM change because the
            change removes the listener
            */
            dropDownClickListener(options, iframeContents);

        });
        observer.observe($(this).contents().find("body")[0], {childList: true, subtree: true});
    });
}
