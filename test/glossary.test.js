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
    assert.equal(numberOfFoundItemsIn(g.gloss("this is a string with item bob")), 1);
    assert.equal(numberOfFoundItemsIn(g.gloss("item item item")), 3);
  });

  it("only finds whole words", function () {
    assert.equal(numberOfFoundItemsIn(g.gloss("item item item itemitem")), 3);
  });

  it("finds words with punctuation around", function () {
    assert.equal(numberOfFoundItemsIn(g.gloss(".item.item")), 2);
    assert.equal(numberOfFoundItemsIn(g.gloss(".item.(item)")), 2);
  });
});

describe("glossary with multiple words", function () {
  var g = new Glossary();
  g.add("item1", []);
  g.add("item2", []);

  it("will find words", function () {
    assert.equal(numberOfFoundItemsIn(g.gloss("this is a string with item1")), 1);
    assert.equal(numberOfFoundItemsIn(g.gloss("this is a string with item2")), 1);
    assert.equal(numberOfFoundItemsIn(g.gloss("this is a string with item1 and item2")), 2);
    assert.equal(numberOfFoundItemsIn(g.gloss("item item item")), 0);
    assert.equal(numberOfFoundItemsIn(g.gloss("item1 item2 item1 item2 something else")), 4);
  });
});

describe("glossary with phrases", function () {
  var g = new Glossary();
  g.add("something nice", []);
  g.add("item2", []);

  it("will find words", function () {
    assert.equal(numberOfFoundItemsIn(g.gloss("this is a string with something nice")), 1);
    assert.equal(numberOfFoundItemsIn(g.gloss("this is a string with item2")), 1);
    assert.equal(numberOfFoundItemsIn(g.gloss("something item nice")), 0);
    assert.equal(numberOfFoundItemsIn(g.gloss("something  nice")), 0);
  });
});

describe("phrases with punctuation", function () {
  var g = new Glossary();
  g.add("j.r. hartley", []);

  it("will find words", function () {
    assert.equal(numberOfFoundItemsIn(g.gloss("my name you see, is j.r. hartley")), 1);
    // . in a regex is a wildcard
    assert.equal(numberOfFoundItemsIn(g.gloss("my name you see, is jxrx hartley")), 0);
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

    assert.equal(str, "x x x x, bobitty x bobitty, x x x x");
  });


  it("calls us back with user data", function () {
    g.gloss("bob").visit({
      gloss: function (text, ud) {
        assert.equal(ud[1], "stuff");
      }
    });
  });
});