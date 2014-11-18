
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
result.visit({
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
Is it a [computer] or a [person] at the other end. Phoning the [electricity company]  you would never know
```



