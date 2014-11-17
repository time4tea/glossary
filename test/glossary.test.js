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

  it("finds words with punctuation around", function () {
    assert.equal(2, numberOfFoundItemsIn(g.gloss(".item.item")));
    assert.equal(2, numberOfFoundItemsIn(g.gloss(".item.(item)")));
  });
});

describe("tree traversal", function () {
  var g = new Glossary();
  g.add("bob", ["user", "stuff"]);

  it("traverses the result tree in order", function() {
    var result = g.gloss("bob bob bob bob, bobitty bob bobitty, bob bob bob bob");
    var str = "";
    result.visit({
      gloss: function (text, ud) {
        str += "x";
      },
      text: function (text) {
        str += text;
      }
    });

    assert.equal("x x x x, bobitty x bobitty, x x x x", str);
  })
});