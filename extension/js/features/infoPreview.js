/*
    Name: infoPreview.js
    Desc: allows students to preview information of a course with elements next to unexpanded courses
*/

function infoPreview(mutations, iframeContents) {
  mutations.forEach(function(mutation) {
    //go through each element that was changed
    mutation.addedNodes.forEach(function(node) {

        //check if sujects are exposed
        if (node.id == "ACE_width") {
            iframeContents.find("div[id^='win0divDERIVED_SSS_BCC_DESCR']").append("<div class='info-preview'><p class='early'>early</p></div>");
        }
    });

  });
}