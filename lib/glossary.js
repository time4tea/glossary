var _ = require("lodash");
var BTree = require("binary-search-tree").BinarySearchTree;

var TextItem = function (text) {
  this._text = text;
};

TextItem.prototype.visit = function(v) {
  v.text(this._text);
};

var GlossaryItem = function (text, ud) {
  this._text = text;
  this._ud = ud;
};

GlossaryItem.prototype.visit = function(v) {
  v.gloss(this._text, this._ud);
};

var GlossResult = function (tree) {
  this._tree = tree;
};

GlossResult.prototype.visit = function(v) {
    this._tree.executeOnEveryNode(function(n) {
      n.data[0].visit(v);
    })
};

var Glossary = function () {
  this._items = [];
};

Glossary.prototype.add = function (s, ud) {
  this._items.push([ s, ud ]);
};

function repeat(pattern, count) {
  if (count < 1) return '';
  var result = '';
  while (count > 1) {
    if (count & 1) result += pattern;
    count >>= 1, pattern += pattern;
  }
  return result + pattern;
}

function replaceLength(string, start, length) {
  return string.slice(0, start) + repeat('~', length) + string.slice(start + length);
}

Glossary.prototype.gloss = function (string) {

  var tree = new BTree();

  _.forEach(this._items, function (item) {
    {
      var term = item[0];
      var ud = item[1];
      var length = term.length;

      var index = string.indexOf(term);
      while (index >= 0) {
        tree.insert(index, new GlossaryItem(term, ud));
        string = replaceLength(string, index, length);
        index = string.indexOf(term, index + length);
      }
    }
  });

  var start = 0;
  var end = 0;

  while ( true ) {
    while ( string.charAt(start) == '~' && start < string.length ) start++;
    if ( start == string.length ) break;
    end = start+1;
    while ( string.charAt(end) != '~' && end < string.length ) end++;
    tree.insert(start, new TextItem(string.slice(start, end)));
    if ( end == string.length ) break;
    start = end;
  }

  return new GlossResult(tree);
};

module.exports = Glossary;