var Glossary = require("../index").Glossary;

var DOMParser = require('xmldom').DOMParser;
var xpath = require('xpath');
var fs = require('fs');

// Download: http://www.microsoft.com/Language/en-US/Terminology.aspx
// this example requires a file: MicrosoftTermCollection.tbx to be in the working directory.
// and a text file called sample.txt
// npm install xmldom xpath

var sampleFileName = "sample.txt";
var tbxFileName = "MicrosoftTermCollection.tbx";
var doc = new DOMParser().parseFromString(fs.readFileSync(tbxFileName, 'utf-8'));

var nodes = xpath.select("//langSet[@lang='en-US']", doc);

console.log("Loading " + nodes.length + " definitions ");

var glossary = new Glossary();

for ( var i = 0 ; i < nodes.length ; i++ ) {
  var node = nodes[i];

  var description = xpath.select(".//descrip/text()", node).toString();
  var term = xpath.select(".//term/text()", node).toString();

  glossary.add(term, [ description ]);
}

var text = fs.readFileSync(sampleFileName, 'utf-8');
console.log("Text length " + text.length);

var before = new Date().getTime();

var result = glossary.gloss(text);

var after = new Date().getTime();

console.log("Parse in " + ( after - before ) + " ms");

var g_count = 0, t_count = 0;
result.accept({
  gloss: function() { g_count++ },
  text: function() { t_count++; }
});

console.log("Found entries " + g_count + ", Text nodes " + t_count);

//result.accept({
//  gloss: function(text) { console.log('[' + text + ']') },
//  text: function(text) { console.log(text) }
//});



