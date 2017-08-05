/*
    Name: infoPreview.js
    Desc: allows students to preview information of a course with elements next to unexpanded courses
*/

function infoPreview(mutations, iframeContents) {
  mutations.forEach(function(mutation) {
    //go through each element that was changed
    mutation.addedNodes.forEach(function(node) {
      if (node.id == "ACE_width") {
          console.log("adding");
          //remove old number
          iframeContents.find("span[id^='DERIVED_SSS_BCC_DESCR']").css("display","none");

          //add badge holder + description
          iframeContents.find("div[id^='win0divDU_SS_SUBJ_CAT_DESCR']").append("<div class='info-preview'><span class='description-info'>description</span></div>");
      }
    });

  });
}