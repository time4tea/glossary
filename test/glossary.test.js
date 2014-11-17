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

describe("glossary with multiple words", function() {
  var g = new Glossary();
  g.add("item1", []);
  g.add("item2", []);

  it("will find words", function () {
    assert.equal(1, numberOfFoundItemsIn(g.gloss("this is a string with item1")));
    assert.equal(1, numberOfFoundItemsIn(g.gloss("this is a string with item2")));
    assert.equal(2, numberOfFoundItemsIn(g.gloss("this is a string with item1 and item2")));
    assert.equal(0, numberOfFoundItemsIn(g.gloss("item item item")));
    assert.equal(4, numberOfFoundItemsIn(g.gloss("item1 item2 item1 item2 something else")));
  });
});

describe("glossary with phrases", function() {
  var g = new Glossary();
  g.add("something nice", []);
  g.add("item2", []);

  it("will find words", function () {
    assert.equal(1, numberOfFoundItemsIn(g.gloss("this is a string with something nice")));
    assert.equal(1, numberOfFoundItemsIn(g.gloss("this is a string with item2")));
    assert.equal(0, numberOfFoundItemsIn(g.gloss("something item nice")));
    assert.equal(0, numberOfFoundItemsIn(g.gloss("something  nice")));
  });
});

describe("tree traversal", function () {
  var g = new Glossary();
  g.add("bob", ["user", "stuff"]);

  it("traverses the result tree in order", function () {
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
  });


  it("calls us back with user data", function () {
    g.gloss("bob").visit({
      gloss: function (text, ud) {
        assert.equal("stuff", ud[1]);
      }
    });
  });
});