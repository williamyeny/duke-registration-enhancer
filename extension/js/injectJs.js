/*
    Name: injectJS.js
    Desc: Runs Javascript files (features, listeners, etc.) when the embedded registration iframe loads.
          Important: despite also prefixed with "inject", this file interacts with the iframe from the parent dom once the iframe loads, 
          as opposed to injectCss.js, which directly injects CSS into the iframe.
*/

// when selecting elements in the registration page, you call iframeContents.find("query here") instead of $("query here")
var iframeContents;

function injectJs() {

    // enable schedule builder
    console.log("Logging into Schedule Builder...");
    $.get("https://csprd.siss.duke.edu/psc/CSPRD01/EMPLOYEE/SA/c/SA_LEARNER_SERVICES_2.SSR_SSENRL_CART.GBL?page=DU_COLLSCHD_LAUNCH", function (data) {
        console.log("Successfully logged into Schedule Builder!");
    });

    // Runs when the main registration window loads
    $("#ptifrmtgtframe").on("load", function () {
        // get contents of the loaded frame
        iframeContents = $(this).contents();

        // add options button
        if (features.optionsButton.enabled) optionsButton();

        // when dom is changed...
        var observer = new MutationObserver(function (mutations) {
            /*
            We need to add the click listener with every iframe DOM change because the
            change removes the listener
            */
            dropDownClickListener();

            // add RateMyProfessors link
            if (features.rmpLink.enabled) rmpLink(mutations);

            // info preview
            if (features.infoPreview.enabled) infoPreview(mutations);
        });
        
        // observe the body of the iframe when any elements are added
        observer.observe($(this).contents().find("body")[0], { childList: true, subtree: true }); 
    });
}
