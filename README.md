# not-so-random
Lib allowing to use rules to configuration the extraction of random members of an array.

## Usage example

```javascript
import {extractMembers} from 'not-so-random';

var data = [
    { "name": "Stewie", "show": "Family Guy" },
    { "name": "Brian", "show": "Family Guy" },
    { "name": "Peter", "show": "Family Guy" },
    { "name": "Lois", "show": "Family Guy" },
    { "name": "Meg", "show": "Family Guy" },
    { "name": "Chris", "show": "Family Guy" },
    { "name": "Homer", "show": "The Simpsons" },
    { "name": "Marge", "show": "The Simpsons" },
    { "name": "Bart", "show": "The Simpsons" },
    { "name": "Lisa", "show": "The Simpsons" },
    { "name": "Maggie", "show": "The Simpsons" }
]

var rules = [
    {
        count: 2,
        test: function(character) { return character.show == "The Simpsons"; }
    },
    {
        count: 3,
        test: function(character) { return character.show == "Family Guy"; }
    }
]

// Will generate an array with 2 characters from the
// Simpsons and 3 from Family Guy
var randomCharacters = extractMembers(data, rules);
```

## Why is it cool ?

This lib is useful when several rules match the same items and can cause a rule
to not have enough candidates. not-so-random will decide in which order to run
the rules in order to allow every rules to have enough candidates.

Here is an example :

```javascript

var data = [
    { "id": 1, "tags": ["foo", "bar"] },
    { "id": 2, "tags": ["foo"] },
    { "id": 3, "tags": ["foo"] },
    { "id": 4, "tags": ["bar"] }
]

var rules = [
    {
        count: 2,
        test: function(doc) { return doc.tags.indexOf("foo") >= 0; }
    },
    {
        count: 2,
        test: function(doc) { return doc.tags.indexOf("bar") >= 0; }
    }
]

```

If the first rule was blindly executed first and randomly matched the document
with id 1, the second rule would not have enough candidates to match 2 items.
Since the data allows the 2 rules to find enough matches, not-so-random
determines in which order to run the rules to find a possible extraction.


## Work In progress

This project is very very young and I still have a lot of things to do.

+ Build the lib to be usable in commonJS / browser
+ unit testing
+ Doc
