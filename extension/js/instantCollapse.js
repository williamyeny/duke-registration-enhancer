function instantCollapse(button, iframeContents, e) {
    //if it is in expanded form
  var buttonImage = $(button).children();
  if (buttonImage.attr("src") == "/cs/CSPRD01/cache/PS_COLLAPSE_ICN_1.gif") {
    console.log("courses section is expanded");
    e.preventDefault();

    var buttonId = $(button).attr("id");
    //just get number off of the end of the ID
    var buttonNumber = buttonId.replace("DU_SEARCH_WRK_SSR_EXPAND_COLLAPS$", "");

    /*
    delete the expanded courses section!
    (we are forced to use .parent() is because the tr's dont have ids!)
    */
    var coursesSection = iframeContents.find("#win0divGROUP_CAT\\$" + buttonNumber).parent().parent();
    //remove the spacing tr first
    console.log("HTML: " + coursesSection.next().html());
    coursesSection.next().remove();
    //remove the actual tr
    coursesSection.remove();

    //restore "expanded" button image
    buttonImage.attr("src", "/cs/CSPRD01/cache/PS_EXPAND_ICN_1.gif");

    //TODO: trick the site into thinking it is truly collapsed so attempting to reopen a collapsed subject won't reset it
    
    // iframeContents.find("#ICStateNum").val(parseInt(iframeContents.find("#ICStateNum").val()) + 1);
  } else { //if it's not in expanded form

  }
}