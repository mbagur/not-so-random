var expect = require('chai').expect;
var notSoRandom = require('../lib/notSoRandom.js').default;

var data = require('./data/data1.json');
var emptyData = require('./data/empty.json');

describe('not-so-random', function() {
    it('should return A or F', function() {

        var rules = [
            { count: 1, test: function(e) { return e.score == 8}}
        ];
        var extracted = notSoRandom(data, rules);
        expect(extracted).to.be.instanceof(Array);
        expect(extracted).to.have.lengthOf(1);
        // chai does not help to test OR conditions (due to test philosophy)
        // since we are testing "random" results here, I bypass this by
        // creating a simple bool var for the test
        var n = extracted[0].name;
        var test = (n=="A" || n=="F");
        expect(test).to.be.true;

    });

    it('should return A and F', function() {
        var rules = [
            { count: 2, test: function(e) { return e.score == 8}}
        ];
        var extracted = notSoRandom(data, rules);
        expect(extracted).to.be.instanceof(Array);
        expect(extracted).to.have.lengthOf(2);
    });

    it('should fail', function() {
        var rules = [
            { count: 2, test: function(e) { return e.score > 20}}
        ];
        var f = function() { notSoRandom(data, rules); }
        expect(f).to.throw(Error);
    })

    it('should fail too', function() {

      var rules = [
        { count: 2, test: function(e) { return e.score == 8}}
      ];
      var f = function() { notSoRandom(emptyData, rules); }
      expect(f).to.throw(Error);
    })
});
