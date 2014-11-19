var Glossary = require("../index").Glossary;

var assert = require("assert");

var glossary = new Glossary();

glossary.add("computer", {});
glossary.add("person", {});
glossary.add("electricity company", {});

var text = "Is it a computer or a person at the other end. Phoning the electricity company you would never know";
var result = glossary.gloss(text);

var glossarised = "";
result.accept({
  gloss: function (text) {
    glossarised += "[" + text + "]"
  },
  text: function (text) {
    glossarised += text;
  }
});

console.log(glossarised);

assert.equal("Is it a [computer] or a [person] at the other end. Phoning the [electricity company] you would never know", glossarised);
