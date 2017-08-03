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

                console.info("Professor first name: " + firstName + ", last name: " + lastName);

                //search RMP for professor
                var span = $(this);
                var url = "http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=duke+university&queryoption=HEADER&query=" + firstName + "+" + lastName + "&facetSearch=true"
                console.info(url)
                var result = pname.link(url); 
                document.getElementById('DU_DERIVED_SS_DESCR100_2').innerHTML = result;  	
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
