var fs    = require("fs");
var _     = require("lodash");

var negatives = fs.readFileSync("sentences.txt", "utf8").split("\n");

var cleanNegatives = [];
var array = [];

negatives.map(function(sentence){
  console.log("Sentence: ", sentence);
  array = sentence.split(" ");
  console.log("Array: ", array);

  array = removeLinks(array);
  console.log("Sem Links: ", array);
});


function removeLinks (array) {
    var arrayWithoutLinks = array.map(function (item) {
      if(!_.include(item, "http")){
        return item.trim();
      }
    });
    return arrayWithoutLinks;
}