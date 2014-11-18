var _ = require("lodash");
var Aho = require("./aho-corasick.js");
var BTree = require("binary-search-tree").BinarySearchTree;

var TextItem = function (text) {
    this._text = text;
};

TextItem.prototype.visit = function (v) {
    v.text(this._text);
};

var GlossaryItem = function (text, ud) {
    this._text = text;
    this._ud = ud;
};

GlossaryItem.prototype.visit = function (v) {
    v.gloss(this._text, this._ud);
};

var GlossResult = function (tree) {
    this._tree = tree;
};

GlossResult.prototype.visit = function (v) {
    this._tree.executeOnEveryNode(function (n) {
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

Glossary.prototype.gloss = function (text) {

    var tree = new BTree();

    var trie = new Aho.TrieNode();

    _.forEach(this._items, function (item) {
        var term = item[0];
        var ud = item[1];
        trie.add(term, ud);
    });

    Aho.add_suffix_links(trie);

    var splits = [];

    Aho.search(text, trie, function (found_word, index, data) {
        tree.insert(index, new GlossaryItem(found_word, data));
        splits.push(index);
        splits.push(index + found_word.length);
    });

    var start = 0;
    if (splits.length == 0) {
        tree.insert(0, new TextItem(text));
    }
    else {
        for (var i = 0; i < splits.length; i++) {

            var index = splits[i];

            if (index - start > 0) {
                tree.insert(i, new TextItem(text.substr(start, index)));
            }
            start = index;
        }
    }

    return new GlossResult(tree);
};

module.exports = Glossary;