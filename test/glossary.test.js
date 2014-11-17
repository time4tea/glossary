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

describe("a simple glossary", function () {
  var g = new Glossary();
  g.add("item", ["user", "stuff"]);

  it("will find words", function () {
    assert.equal(1, numberOfFoundItemsIn(g.gloss("this is a string with item bob")), "should find 1 item");
    assert.equal(3, numberOfFoundItemsIn(g.gloss("item item item")), "should find 3 items");
  });

  it("only finds whole words", function () {
    assert.equal(3, numberOfFoundItemsIn(g.gloss("item item item itemitem")));
  });
});