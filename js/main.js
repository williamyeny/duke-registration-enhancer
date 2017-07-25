$(function() {
  console.info("drmp: duke rmp loaded");

  //ptifrmtgtframe: ID of the iframe holding the courses
  $("#ptifrmtgtframe").on("load", function() {
    console.info("drmp: iframe loaded");
    var observer = new MutationObserver(function(mutations) {

      mutations.forEach(function(mutation) {
        //go through each element that was changed
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeName == "TABLE") {
            console.info("drmp: table modified");
            //loop through spans with professor name(s)
            var pspans = $("#ptifrmtgtframe").contents().find("span[id*='DU_DERIVED_SS_DESCR100_2']");
            if (pspans.length > 0) {
              pspans.each(function(index) {
                //get professor name(s)
                var pname = $(this).text();
                //modify professor name(s)

                // check if course has two instructors- DukeHub puts a dash in between, thank god
                var pnameSplit;
                if (pname.indexOf("-") > -1) {
                  var pnames = pname.split("-");
                  pnameSplit = pnames[0].split(" ");
                  // need to figure out how to make API calls and injections for both professors? For now, we just get rating for the first (primary) instructor.
                } else {
                  pnameSplit = pname.split(" ");
                }

                //split full name into first and last name for API call
                var firstName =  pnameSplit[0];
                var lastName = pnameSplit[pnameSplit.length - 1];
                // fix for suffixes
                if (['I', 'II', 'III', 'IV', 'V', 'Jr.', 'Sr.', 'Phd.'].indexOf(lastName) > -1) { 
                  lastName = pnameSplit[pnameSplit.length - 2]; 
                }

                console.info("drmp: professor first name: " + firstName + ", last name: " + lastName);

                //search RMP for professor
                var span = $(this);
                var url = "http://search.mtvnservices.com/typeahead/suggest/?q=" + firstName + "+" + lastName + "+AND+schoolid_s%3A1350&siteName=rmp&fl=teacherfirstname_t+teacherlastname_t+total_number_of_ratings_i+averageratingscore_rf+pk_id"
                chrome.runtime.sendMessage({
                  method: 'GET',
                  action: 'xhttp',
                  url: url,
                }, function(responseText) {
                  var read = JSON.parse(responseText);

                  var ratingHtml;
                  var ratingValue;
                  var ratingColor;
                  var ratingLink;
                  //check if professor exists on rmp
                  if (read.response.numFound > 0 && read.response.docs[0].total_number_of_ratings_i > 0) {
                    //get rating info
                    var rating = read.response.docs[0].averageratingscore_rf;
                    ratingLink = "https://www.ratemyprofessors.com/ShowRatings.jsp?tid=" + read.response.docs[0].pk_id;
                    //determine color based on rating
                    var color;
                    if (rating > 3.4) {
                      color="green";
                    } else if (rating > 2.5) {
                      color="yellow";
                    } else {
                      color="red";
                    }
                    ratingValue = rating;
                    ratingColor = color;
                  } else {
                    ratingValue = "?";
                    ratingColor = "grey";
                    ratingLink = "javascript:void(0)";

                    if (pname === "Departmental Staff") {
                      ratingValue = "N/A";
                    }
                  }
                  //add rest of html
                  ratingHtml = "<div class='prof-wrapper'><a target='_blank' href='" + ratingLink + "' class='color-" + ratingColor + " rating'>" + ratingValue + "</a></div>";
                  //inject to HTML
                  span.parent().after(ratingHtml); //puts it into td
                  //move span to wrapper
                  span.prependTo(span.parent().parent().children(".prof-wrapper"));

                });
              });
            }
          }
        });

      });
    });

    var targetNode = $("#ptifrmtgtframe").contents().find("body")[0]; //checking for changes in iframe
    var observerConfig = {
      childList: true, // detects if elements are added or removed
      subtree: true //detects all elements in body, not just direct children
    };
    observer.observe(targetNode, observerConfig);

  });

})
