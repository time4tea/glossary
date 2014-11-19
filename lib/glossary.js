
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

GlossResult.prototype.accept = function (v) {
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

Glossary.prototype.gloss = function (text) {

    var tree = new BTree();

    var trie = new Aho.TrieNode();

    this._items.forEach(function (item) {
        var term = item[0];
        var ud = item[1];
        trie.add(term, ud);
    });

    Aho.add_suffix_links(trie);

    var splits = [];

    Aho.search(text, trie, function (found_word, index, data) {
        tree.insert(index, new GlossaryItem(found_word, data[0]));
        splits.push([index, index + found_word.length]);
    });

    if (splits.length == 0) {
        tree.insert(0, new TextItem(text));
    }
    else {
        var start = 0;

        for (var i = 0; i < splits.length; i++) {

            var word_start = splits[i][0];
            var word_end = splits[i][1];

            if ( word_start - start > 0 ) {
                tree.insert(start, new TextItem(text.slice(start, word_start)));
            }
            start = word_end;
        }

        if ( start != text.length ) {
            tree.insert(start, new TextItem(text.slice(start)));
        }
    }

    return new GlossResult(tree);
};

module.exports = Glossary;