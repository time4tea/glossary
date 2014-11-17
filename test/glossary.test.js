var assert = require("assert");

var Glossary = require("../index").Glossary;

function numberOfFoundItemsIn(result) {
  var count = 0;

  result.visit({
    gloss: function (text, ud) {
      count++;
    },
    text: function (text) {
    }
  });

  return count;
}

describe("a glossary", function () {
  it("will find words", function () {
    var g = new Glossary();
    g.add("item", ["user", "stuff"]);

    assert.equal(1, numberOfFoundItemsIn(g.gloss("this is a string with item bob")));
  });
});