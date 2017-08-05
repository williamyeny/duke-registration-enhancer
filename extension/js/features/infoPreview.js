/*
    Name: infoPreview.js
    Desc: allows students to preview information of a course with elements next to unexpanded courses
*/

//when selecting elements in the registration page, you call iframeContents.find("query here") instead of $("query here")
var iframeContents;

function infoPreview(mutations, ifc) {
  iframeContents = ifc;

  mutations.forEach(function (mutation) {
    //go through each element that was changed
    mutation.addedNodes.forEach(function (node) {
      if (node.id == "ACE_width") {

        //remove old number
        iframeContents.find("span[id^='DERIVED_SSS_BCC_DESCR']").css("display", "none");

        //add badge holder + description
        var defaultTooltip = "Loading...";
        var descHtml = "<span class='description-info'>description<span class='description-tooltip'>" + defaultTooltip + "</span></span>";
        iframeContents.find("div[id^='win0divDU_SS_SUBJ_CAT_DESCR']").append("<div class='info-preview'>" + descHtml + "</div>");

        //add listeners                
        iframeContents.find(".description-info").mouseover(function () {
          var tooltip = $(this).children();
          tooltip.css("display", "inline");

          //get description                    
          if (tooltip.html() == defaultTooltip) {
            var courseUrl = buildUrl(this);

            console.log("request sent...");
            $.getJSON(courseUrl, function (data) {

              //expand to fit content
              tooltip.css("width", "400");
              //inject description
              tooltip.html(data.description);
            });

          }
        });

        iframeContents.find(".description-info").mouseout(function () {
          $(this).children().css("display", "none");
        });
      }
    });

  });
}

//e.g. 101
function getCourseNumber(index) {
  //uses course index to find corresponding element containing course number with same index 
  return iframeContents.find("#DU_SS_SUBJ_CAT_CATALOG_NBR\\$" + index).html();
}

//e.g. ECON
function getSubjectCode(elementId) {
  var subjectCode;

  //loops through all cells containing subjects
  iframeContents.find("#ACE_SUBJECT\\$0 > tbody:first-child > tr").each(function () {
    //check if cell contains the specified element ID
    if ($(this).html().includes(elementId)) {
      //grabs subject code by finding previous cell's value
      subjectCode = $(this).prev().find("span[id^='SSR_CLSRCH_SUBJ_SUBJECT']").html();
      return false; //break out of each function
    }
  });
  return subjectCode;
}

function buildUrl(badge) {
  //sample URL: https://duke.collegescheduler.com/api/terms/2017%20Fall%20Term/subjects/AAAS/courses/103

  //get term
  var term = iframeContents.find("#DU_SEARCH_WRK_STRM :selected").text();
  var termEncoded = term.replace(/\s/g, '%20');

  var parentId = $(badge).parent().parent().attr("id");

  //get number at the end of ID (specifies course)
  var courseIndex = parentId.replace("win0divDU_SS_SUBJ_CAT_DESCR$", "");
  //get courseNumber
  var courseNumber = getCourseNumber(courseIndex);

  //get subject
  var subjectCode = getSubjectCode(parentId);

  //build URL
  return "https://duke.collegescheduler.com/api/terms/" + termEncoded + "/subjects/" + subjectCode + "/courses/" + courseNumber;
}