/*
    Name: infoPreview.js
    Desc: allows students to preview information of a course with elements next to unexpanded courses
*/

//when selecting elements in the registration page, you call iframeContents.find("query here") instead of $("query here")
var iframeContents;
var cache;
const defaultTooltip = "Loading...";

function infoPreview(mutations, ifc, c) {
  iframeContents = ifc;

  cache = c;

  mutations.forEach(function (mutation) {
    //go through each element that was changed
    mutation.addedNodes.forEach(function (node) {
      if (node.id == "ACE_width") {

        //remove old number
        iframeContents.find("span[id^='DERIVED_SSS_BCC_DESCR']").css("display", "none");

        //add badge holder + badges
        var descHtml = "<div class='description-info'>Description<div class='description-tooltip'><p>" + defaultTooltip + "</p></div></div>";
        console.log(descHtml);
        iframeContents.find("div[id^='win0divDU_SS_SUBJ_CAT_DESCR']").append("<div class='info-preview'>" + descHtml + "</div>");

        //add listeners                
        addDescriptionHover(); // passes in defaultToolTip to check if it has not been loaded
      }
    });

  });
}

function addDescriptionHover() {
  iframeContents.find(".description-info").mouseover(function () {
    var tooltip = $(this).children();
    // make tooltip visible
    tooltip.css("display", "inline");

    //populate description                    
    if (tooltip.children().html() == defaultTooltip) {

      //check if course exists in cache already
      var courseCode = getCourseCode(this); 
      if (courseCode in cache) {
        tooltip.html(cache[courseCode].description);
      } else { // course not in cache -- get course desc from API
        var courseUrl = buildUrl(this);

        console.log("request sent...");
        $.getJSON(courseUrl, function (data) { 
          console.log(JSON.stringify(data));
          // get course description
          var description = data.sections[0].description;

          // add 'early' warning
          var earlyText = "";
          data.sections.some(function(section) { //https://stackoverflow.com/questions/2641347/how-to-short-circuit-array-foreach-like-calling-break
            var meeting = section.meetings[0];

            if (meeting.startTime >= 900 && (section.component == "LEC" || section.component == "SEM")) { // if after 9 am, break
              return true; // won't break if omitting true
            } else if (section == data.sections[data.sections.length-1]) { // else if last index (none after 9am)
              earlyText = "Lectures start before 9am!";
            }
          });

          // add 'full' warning
          var fullText = "";
          data.sections.some(function(section) {

            if (section.openSeats > 0 && (section.component == "LEC" || section.component == "SEM")) {
              return true;
            } else if (section == data.sections[data.sections.length-1]) {
              fullText = "All lectures are full!";
            }
          });

          var tooltipHtml = formatDescription(description) + "<p>" + fullText + "<p></p>" + earlyText + "</p>";

          // update cache
          updateCache(courseCode, "description", tooltipHtml); 

          //inject into tooltip
          tooltip.html(tooltipHtml);
        }).fail(function () { // if unable to get URL
          alert("Duke Registration Enhancer error: unable to get description. Try refreshing the page!");
        });
      }
      //expand to fit content
      tooltip.css("width", "400");
    }
  });

  iframeContents.find(".description-info").mouseout(function () {
    $(this).children().css("display", "none");
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

//e.g. ECON 101
function getCourseCode(badge) {
  var parentId = $(badge).parent().parent().attr("id");

  //get number at the end of ID (specifies course)
  var courseIndex = parentId.replace("win0divDU_SS_SUBJ_CAT_DESCR$", "");

  return getSubjectCode(parentId) + getCourseNumber(courseIndex);
}

function buildUrl(badge) {
  //sample URL: https://duke.collegescheduler.com/api/terms/2017%20Fall%20Term/subjects/AAAS/courses/103/regblocks

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
  return "https://duke.collegescheduler.com/api/terms/" + termEncoded + "/subjects/" + subjectCode + "/courses/" + courseNumber + "/regblocks";
}

function formatDescription(desc) {
  desc = partitionByKeyword(desc, "Instructor:");
  desc = partitionByKeyword(desc, "Prerequisite:");
  return "<p>" + desc + "</p>";
}

function partitionByKeyword(text, keyword) {
  var index = text.indexOf(keyword);
  if (index != -1) {
    text = text.substring(0, index) + "</p><p><strong>" + text.substring(index, index + keyword.length) + "</strong>" + text.substring(index + keyword.length, text.length);
  }
  return text;
}

function updateCache(courseCode, cacheKey, cacheValue) {
  if (courseCode in cache) {                  // if exists...
    cache[courseCode][cacheKey] = cacheValue; // update property
  } else {
    cache[courseCode] = {[cacheKey]: cacheValue}; // else, create a new course hash with that property
  }

  //sync cache
  chrome.storage.sync.set(cache, function () {
    console.log("cache synced!");
  });       
}