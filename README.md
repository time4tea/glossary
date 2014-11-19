
# Find items in a glossary in some text

Example
-------

Your glossary contains the items:

computer
person
electricity company

You would like to mark up the text:

Is it a computer or a person at the other end. Phoning the electricity company you would never know

```javascript

var glossary = new Glossary();

glossary.add("computer", {});
glossary.add("person", {});
glossary.add("electricity company", {});

var text = "Is it a computer or a person at the other end. Phoning the electricity company you would never know";
var result = glossary.gloss(text);

var glossarised = [];
result.accept({
  gloss: function (text) {
    glossarised += "[" + text + "]"
  },
  text: function (text) {
    glossarised += text;
  }
});

console.log(glossarised);
```

Gives the output

```
Is it a [computer] or a [person] at the other end. Phoning the [electricity company] you would never know
```


## So what, that's a tiny file! - not very exciting

The implementation, based on the Aho-Corasick text searching algorthim, should support reasonably large glossaries,
and run in a short amount of time for large texts.

See examples/microsoft.js for a more realistic example (on my laptop):

```
Loading 2451 definitions 
Text length 268,647
Parse in 320 ms
Found entries 1797, Text nodes 1709
```


