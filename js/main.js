console.log("enhancer loaded");

$("iframe").on("load", function() {
  console.log("test");
});

// var observer = new MutationObserver(function(mutations) {
//
//   mutations.forEach(function(mutation) {
//     //go through each element that was changed
//     mutation.addedNodes.forEach(function(node) {
//       if (node.nodeName == "HEAD") {
//         console.log("head");
//       }
//       console.log(node.nodeName);
//     });
//   });
// });
// var targetNode = $(document).contents().find("body")[0]; //checking for changes in iframe
// var observerConfig = {
//   childList: true, // detects if elements are added or removed
//   subtree: true //detects all elements in body, not just direct children
// };
// observer.observe(targetNode, observerConfig);
