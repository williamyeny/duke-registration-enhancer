/*
    Name: infoPreview.js
    Desc: allows students to preview information of a course with elements next to unexpanded courses
*/

// when selecting elements in the registration page, you call iframeContents.find("query here") instead of $("query here")

// default content of tooltip
const defaultTooltip = "Loading...";

function infoPreview(mutations) {

  mutations.forEach(function (mutation) {
    // go through each element that was changed
    mutation.addedNodes.forEach(function (node) {
      if (node.id == "ACE_width") {

        // add badge holder + badges
        var descHtml = "<div class='description-info'>Description<div class='description-tooltip'><p>" + defaultTooltip + "</p></div></div>";
        var timesHtml = "<div class='times-info'>Days & Times<div class='times-tooltip'><p>" + defaultTooltip + "</p></div></div>";
        iframeContents.find("div[id^='win0divDU_SS_SUBJ_CAT_DESCR']").append("<div class='info-preview'>" + descHtml + timesHtml + "</div>");

        // add listeners
        if (features.infoPreview.settings.clickView.enabled) {
          iframeContents.find("div[class$='-info']").css("cursor","pointer");
          addClick();
        } else {
          addHover();
        }
        
      }
    });

  });
}

function addHover(badgeName) { // badgeName: e.g. "description", "synopsis"
  iframeContents.find("div[class$='-info']").mouseover(function () {
    showTooltip(this, $(this).attr("class").replace("-info",""));
  });

  iframeContents.find("div[class$='-info']").mouseout(function () {
    hideTooltip(this);
  });
}

function addClick() {
  // hiding tooltips on click
  iframeContents.find("body, .PABACKGROUNDINVISIBLEWBO").on("click", function (e) { // for some reason, selecting body doesnt include PABACKGROUNDINVISIBLEWBO
    var isBadge = $(e.target).attr("class") && $(e.target).attr("class").includes("-info");
    if (isBadge && $(e.target).children().css("display") != "none") { // if clicked on badge and tooltip is visible...
      hideTooltip(e.target); // hide that tooltip
    } else if(!isBadge && !$(e.target).parent("div[class$='-info']").length) { // else, if not clicked on any badge + its contents...g
      hideTooltip(iframeContents.find("div[class$='-info']")); // hide all tooltips
    } else 

    // show tooltips if there is nothing to hide
    if (isBadge){
      showTooltip(e.target, $(e.target).attr("class").replace("-info",""));
    }
  });
}

function showTooltip(badge, badgeName) { // badgeName is "description", "synopsis" etc
  var tooltip = $(badge).children();
  var courseCode = getCourseCode(badge);

  // check cache to see the current course's info is outdated
  if (expireCacheEntry(courseCode, badgeName)) {
    tooltip.html("<p>" + defaultTooltip + "</p>"); // if so, clear tooltip
  }

  //populate description                    
  if (tooltip.children().html() == defaultTooltip) {
    
    if (courseCode in cache && badgeName in cache[courseCode]) { // if it is in cache already....
      tooltip.html(cache[courseCode][badgeName].value); // get the data of the badge from the cache
    } else { // course not in cache -- do initial set of tooltip
      if (badgeName == "description" || badgeName == "times") { // we update both tooltips when either badge is activated
        setDescriptionTooltip(badge, tooltip);
      }
    }
  }

  // make visible
  tooltip.css("display", "inline");

  // set size
  if (tooltip.width() > 400) {
    tooltip.css("white-space","normal");
    tooltip.css("width","400px");
  }
}

function hideTooltip(badge) {
  $(badge).children().css("display", "none");
}

function setDescriptionTooltip(badge, tooltip) {
  // check if it has multiple topics
  var multipleTopics = false;
  if ($(badge).parent().parent().parent().parent().next().find("div[id^='win0divDU_DERIVED_HTMLAREA1']").length) {
    multipleTopics = true;
  }

  // get URL
  var courseUrl = buildDescriptionUrl(badge, multipleTopics);

  console.log("request sent...");
  $.getJSON(courseUrl, function (data) {

    var tooltipHtml;
    if (!multipleTopics) { // if it doesn't have multiple topics...
      // get course description
      var description = data.sections[0].description;

      // get old number
      var oldNumberText = ""
      if (features.infoPreview.settings.showOldNumber.enabled) {
        var oldNumber = iframeContents.find("#DERIVED_SSS_BCC_DESCR\\$" + getCourseIndex(badge)).text();
        oldNumberText = "<p><strong>Old number: </strong>" + oldNumber + "</p>";
      }

      // add 'early' warning
      var earlyText = "";
      data.sections.some(function (section) { // https://stackoverflow.com/questions/2641347/how-to-short-circuit-array-foreach-like-calling-break
        var meeting = section.meetings[0];

        if (meeting.startTime >= 900 && isLecture(section)) { // if after 9 am, break
          return true; // won't break if omitting true
        } else if (section == data.sections[data.sections.length - 1]) { // else if last index (none after 9am)
          earlyText = "<span class='early-warning'>Lectures start before 9 AM</span>";
        }
      });

      // add 'full' warning
      var fullText = "";
      data.sections.some(function (section) {
        if (section.openSeats > 0 && isLecture(section)) {
          return true;
        } else if (section == data.sections[data.sections.length - 1]) {
          fullText = "<span class='full-warning'>Lectures are full</span>";
        }
      });

      // add 'instructor consent' warning
      var consentText = "";
      data.sections.some(function (section) {
        if (section.enrollmentRequirements[0].description == "No Special Consent Required" && isLecture(section)) {
          return true;
        } else if (section == data.sections[data.sections.length - 1]) {
          consentText = "<span class='consent-warning'>Instructor consent required</span>";
        }
      });

      tooltipHtml = formatDescription(description) + oldNumberText + "<p>" + fullText + earlyText + consentText + "</p>";
    } else { // if it does have multiple topics, use old URL
      tooltipHtml = formatDescription(data.description);
    }
    // update cache
    updateCache(getCourseCode(badge), "description", tooltipHtml);

    // inject into tooltip
    tooltip.html(tooltipHtml);
    
    // set times toolip
    setTimesTooltip($(badge).parent().children(".times-info").children(), data, multipleTopics);

    // set size
    if (tooltip.width() > 400) {
      tooltip.css("white-space","normal");
      tooltip.css("width","400px");
    }
  }).fail(function () { // if unable to get URL
    console.log("Duke Registration Enhancer error: unable to get description. Try refreshing the page!");
  });
}

function setTimesTooltip(tooltip, data, multipleTopics) { // sets times tooltip using data from previously done request
  tooltip.html("");

  if (!multipleTopics) {
    data.sections.forEach(function (section) { 
      var meeting = section.meetings[0];
      var full = section.openSeats <= 0;

      if (!full || features.infoPreview.settings.showFullTimes.enabled) { // show times of sections that are full only if the setting is enabled

        var spanClass;
        if (isLecture(section)) {
          spanClass = "lec-times";
        } else {
          spanClass = "dis-times";
        }
        if (full) {
          spanClass = "section-full " + spanClass;
        }
        var classTypeHtml = "<span class='" + spanClass + "'>" + section.component + "</span>";

        var timesHtml;
        if (meeting.startTime > 0 && meeting.endTime > 0) {
          timesHtml = toStandardTime(meeting.startTime) + " - " + toStandardTime(meeting.endTime);
        } else {
          timesHtml = "No times available"
        }

        var tooltipHtml = "<p>" + classTypeHtml + meeting.days + " | " + timesHtml + "</p>";
        if (isLecture(section)) {
          tooltip.prepend(tooltipHtml); // bump lectures to the top
        }
        tooltip.append(tooltipHtml);
      }
    });
  } else {
    tooltip.html("<p>Courses with multiple topics have too many times! :(</p>");
  }

  // update cache
  updateCache(getCourseCode(tooltip.parent()), "times", tooltip.html());
}

function toStandardTime(time) { // converts and formats military time to standard time
  time = time.toString();
  var minutes = time.substring(time.length-2, time.length);
  var hour = parseInt(time.substring(0, time.length-2));

  var period = "AM";
  if (hour >= 12) {
    period = "PM";
  }

  if (hour > 12) {
    period = "PM";
    hour -= 12;
  }

  return hour + ":" + minutes + period;
}

function isLecture(section) {
  return section.component == "LEC" || section.component == "SEM";
}

// e.g. 101
function getCourseNumber(index) {
  // uses course index to find corresponding element containing course number with same index 
  return iframeContents.find("#DU_SS_SUBJ_CAT_CATALOG_NBR\\$" + index).html();
}

// e.g. ECON
function getSubjectCode(elementId) { // note: a bit hacky
  var subjectCode;

  // loops through all cells containing subjects
  iframeContents.find("#ACE_SUBJECT\\$0 > tbody:first-child > tr").each(function () {
    // check if cell contains the specified element ID
    if ($(this).html().includes(elementId)) {
      // grabs subject code by finding previous cell's value
      subjectCode = $(this).prev().find("span[id^='SSR_CLSRCH_SUBJ_SUBJECT']").html();
      return false; // break out of "each" function
    }
  });
  return subjectCode;
}

// e.g. ECON 101
function getCourseCode(badge) {
  var courseIndex = getCourseIndex(badge);
  var parentId = getCourseHtmlId(badge);

  return getSubjectCode(parentId) + getCourseNumber(courseIndex);
}

// specifies where the course is physically located
function getCourseIndex(badge) {
  // get number at the end of ID
  return getCourseHtmlId(badge).replace("win0divDU_SS_SUBJ_CAT_DESCR$", "");
}

// returns the HTML ID of a course which holds the specified badge
function getCourseHtmlId(badge) { 
  return $(badge).parent().parent().attr("id");
}

function buildDescriptionUrl(badge, multipleTopics) {
  // sample URL: https://duke.collegescheduler.com/api/terms/2017%20Fall%20Term/subjects/AAAS/courses/103/regblocks

  // get term
  var term = iframeContents.find("#DU_SEARCH_WRK_STRM :selected").text();
  // replace spaces with "%20" for URL usage
  var termEncoded = term.replace(/\s/g, '%20');

  // get course number
  var courseNumber = getCourseNumber(getCourseIndex(badge));

  // get subject
  var subjectCode = getSubjectCode(getCourseHtmlId(badge));

  // build URL
  return "https://duke.collegescheduler.com/api/terms/" + termEncoded + "/subjects/" + subjectCode + "/courses/" + courseNumber + (multipleTopics ? "" : "/regblocks");
}

function formatDescription(desc) {
  desc = partitionByKeyword(desc, "Instructor:");
  desc = partitionByKeyword(desc, "Prerequisite:");
  desc = partitionByKeyword(desc, "Instructors:");
  desc = partitionByKeyword(desc, "Prerequisites:");
  return desc;
}

/* 
  converts raw text to more organized HTML using a keyword to split
  e.g. "This is a description. Instructor: Bob" => "<p>This is a description.<p><p><strong>Instructor</strong>: Bob</p>"
*/
function partitionByKeyword(text, keyword) {
  var index = text.indexOf(keyword);
  if (index != -1) {
    text = text.substring(0, index) + "</p><p><strong>" + text.substring(index, index + keyword.length) + "</strong>" + text.substring(index + keyword.length, text.length);
  }

  // add surrounding tags
  if (text.substring(0, 3) != "<p>") {
    text = "<p>" + text + "</p>";
  }
  return text;
}

function updateCache(courseCode, badgeName, badgeValue) {
  var timestamp = Date.now(); // time stamp
  if (courseCode in cache) {  // if course exists...
    if (badgeName in cache[courseCode]) { // if cacheKey exists in course
      cache[courseCode][badgeName].value = badgeValue; // update property
      cache[courseCode][badgeName].timestamp = timestamp;
    } else {
      cache[courseCode][badgeName] = {value: badgeValue, timestamp: timestamp};
    }
  } else { // if course doesn't exist, create a new course hash with that property
    cache[courseCode] = { 
      [badgeName]: {
        value: badgeValue, 
        timestamp: timestamp 
      }
    }; 
  }

  // upload/sync local cache -> cloud cache
  // chrome.storage.sync.set({
  //   cache: {
  //     [courseCode]: {
  //       [badgeName]: {
  //         value: badgeValue, 
  //         timestamp: timestamp 
  //       }
  //     }
  //   }
  // }); 
}