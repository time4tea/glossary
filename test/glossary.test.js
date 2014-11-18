var assert = require("assert");

var Glossary = require("../index").Glossary;

function numberOfFoundItemsIn(result) {
  var count = 0;

  result.visit({
    gloss: function (text) {
      count++;
    },
    text: function (text) {
    }
  });

  return count;
}

describe("a simple glossary", function () {
  var g = new Glossary();
  g.add("item");

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
  g.add("item1");
  g.add("item2");

  it("finds multiple words", function () {
    assert.equal(numberOfFoundItemsIn(g.gloss("this is a string with item1")), 1);
    assert.equal(numberOfFoundItemsIn(g.gloss("this is a string with item2")), 1);
    assert.equal(numberOfFoundItemsIn(g.gloss("this is a string with item1 and item2")), 2);
    assert.equal(numberOfFoundItemsIn(g.gloss("item item item")), 0);
    assert.equal(numberOfFoundItemsIn(g.gloss("item1 item2 item1 item2 something else")), 4);
  });
});

describe("glossary with phrases", function () {
  var g = new Glossary();
  g.add("something nice");
  g.add("item2");

  it("will find words with phrases", function () {
//    assert.equal(numberOfFoundItemsIn(g.gloss("this is a string with something nice")), 1);
//    assert.equal(numberOfFoundItemsIn(g.gloss("this is a string with item2")), 1);
    assert.equal(numberOfFoundItemsIn(g.gloss("something item nice")), 0);
    assert.equal(numberOfFoundItemsIn(g.gloss("something  nice")), 0);
  });
});

describe("phrases with punctuation", function () {
  var g = new Glossary();
  g.add("j.r. hartley");
  g.add("0.01-carat");

  it("will find words", function () {
    assert.equal(numberOfFoundItemsIn(g.gloss("my name you see, is j.r. hartley")), 1);
    assert.equal(numberOfFoundItemsIn(g.gloss("my name you see, is jxrx hartley")), 0);
    assert.equal(numberOfFoundItemsIn(g.gloss(" 0.01-carat diamond ring")), 1);
  });
});

describe("phrases with accents", function () {
  var g = new Glossary();
  g.add("bouclé");
  g.add("bouclé-tweed");

  it("will find words", function () {
    assert.equal(numberOfFoundItemsIn(g.gloss("some item with bouclé bob")), 1);
    assert.equal(numberOfFoundItemsIn(g.gloss("some item with bouclé-tweed bob")), 1);
  });
});


describe("tree traversal", function () {
  var g = new Glossary();
  g.add("bob");

  it("traverses the result tree in order", function () {
    var result = g.gloss("bob bob bob bob, bobitty bob bobitty, bob bob bob bob");
    var str = "";
    result.visit({
      gloss: function (text) {
        str += "x";
      },
      text: function (text) {
        str += text;
      }
    });

    assert.equal(numberOfFoundItemsIn(result), 9);
    assert.equal(str, "x x x x, bobitty x bobitty, x x x x");
  });

  it("adds text item after the last match", function() {
    var str = ""
    g.gloss("bob this is some text").visit({
      gloss: function(text) { str += '[' + text + ']' },
      text: function(text) { str += text }
    });

    assert.equal("[bob] this is some text", str);
  });
});

describe("some user data", function() {
  var g = new Glossary();
  g.add("bob", ["user", "stuff"]);

  it("calls us back with user data", function () {
    g.gloss("bob").visit({
      gloss: function (text, ud) {
        assert.equal(ud[1], "stuff");
      }
    });
  });

  it("doesn't mind if there is no user data", function () {
    g.gloss("bob").visit({
      gloss: function (text, ud) {
        assert.equal(ud[1], "stuff");
      }
    });
  });
});

describe("no user data", function() {
  var g = new Glossary();
  g.add("bob");

  it("doesn't mind if there is no user data", function () {
    g.gloss("bob").visit({
      gloss: function (text, ud) {
        assert.equal("bob", text);
      }
    });
  });
});