//when selecting elements in the registration page, you MUST call iframeContents.find("query here")
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
            dropDownAddClickListener(options);

        });
        observer.observe($(this).contents().find("body")[0], {childList: true, subtree: true});
    });
}

//Runs when the inner dropdown buttons are clicked
function dropDownAddClickListener(options) {

  //on expand/collapse dropdown button click
  iframeContents.find("a[id*='DU_SEARCH_WRK_SSR_EXPAND_COLLAPS']").on("click", function(e) {
    var button = this;
    var buttonId = $(button).attr("id");

    //e.g. ECON101
    var courseCode = getCourseCode(buttonId);
    console.log(courseCode);

    //run instantCollapse feature (js/instantCollapse.js)
    if (options.instantCollapse) instantCollapse(button, iframeContents, e);

  });
}

//get course code based on the ID of the dropdown button clicked, e.g. ECON101
function getCourseCode(buttonId) {
    return getSubjectCode(buttonId) + getCourseNumber(buttonId);
}

//e.g. 101
function getCourseNumber(buttonId) {
    //get number at the end of ID
    var courseIndex = buttonId.replace("DU_SEARCH_WRK_SSR_EXPAND_COLLAPS$", ""); 
    //use number to find corresponding element containing course number
    var courseNumber = iframeContents.find("#DU_SS_SUBJ_CAT_CATALOG_NBR\\$" + courseIndex).html();
    return courseNumber;
}

//e.g. ECON
function getSubjectCode(buttonId) {
    var subjectCode;
    
    //loop through all cells containing subjects and find the expanded one
    iframeContents.find("#ACE_SUBJECT\\$0 > tbody:first-child > tr").each(function() { 
        //check if cell contains the button that was clicked
        if ($(this).html().includes(buttonId)) {
            //grabs subject code by finding previous cell's value
            subjectCode = $(this).prev().find("span[id^='SSR_CLSRCH_SUBJ_SUBJECT']").html();
            return false; //break out of each function
        }
    });
    return subjectCode;
}