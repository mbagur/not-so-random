import notSoRandom from "../";

var data = require("./data/data1.json");
var emptyData = require("./data/empty.json");

function isInExtracted(extracted, letter) {
    return extracted.some(e => e.name == letter);
}

// TODO use of a mockable random number generator
// because tests can have different results
describe("not-so-random", function() {
    describe("Empty data", function() {
        it("should fail with 1 rule and empty data", function() {
            var rules = [
                {
                    count: 2,
                    test: e => e.score == 8
                }
            ];
            var f = function() {
                notSoRandom(emptyData, rules);
            };
            expect(f).toThrow(Error);
        });

        it("should fail with multiple rules and empty data", function() {
            var rules = [
                { count: 2, test: e => e.score < 10 },
                { count: 1, test: e => e.score > 10 },
                { count: 1, test: e => e.score == 10 }
            ];
            var f = function() {
                notSoRandom(emptyData, rules);
            };
            expect(f).toThrow(Error);
        });
    });

    describe("Data and a single rule", function() {
        it("should return A or F", function() {
            var rules = [
                {
                    count: 1,
                    test: function(e) {
                        return e.score == 8;
                    }
                }
            ];
            var extracted = notSoRandom(data, rules);
            expect(extracted).toBeInstanceOf(Array);
            expect(extracted).toHaveLength(1);
            // chai does not help to test OR conditions (due to test philosophy)
            // since we are testing "random" results here, I bypass this by
            // creating a simple bool var for the test
            var n = extracted[0].name;
            var test = n == "A" || n == "F";
            expect(test).toBeTruthy();
        });

        it("should return A and F", function() {
            var rules = [
                {
                    count: 2,
                    test: e => e.score == 8
                }
            ];
            var extracted = notSoRandom(data, rules);
            expect(extracted).toBeInstanceOf(Array);
            expect(extracted).toHaveLength(2);
        });

        it("should fail", function() {
            var rules = [
                {
                    count: 2,
                    test: function(e) {
                        return e.score > 20;
                    }
                }
            ];
            var f = function() {
                notSoRandom(data, rules);
            };
            expect(f).toThrow(Error);
        });
    });

    describe("Data and multiple rules", function() {
        it("should return A, F, G and D", function() {
            var rules = [
                { count: 2, test: e => e.score == 8 },
                { count: 1, test: e => e.score > 8 },
                { count: 1, test: e => e.score < 2 }
            ];
            var extracted = notSoRandom(data, rules);
            expect(extracted).toBeInstanceOf(Array);
            expect(extracted).toHaveLength(4);
            expect(isInExtracted(extracted, "A")).toBeTruthy();
            expect(isInExtracted(extracted, "F")).toBeTruthy();
            expect(isInExtracted(extracted, "G")).toBeTruthy();
            expect(isInExtracted(extracted, "D")).toBeTruthy();
        });

        it("should return A, D and F", function() {
            // Testing that the first rule will always match D, or else the
            // second rule cannot be satisfied
            var rules = [
                { count: 1, test: e => e.score > 7 },
                { count: 2, test: e => e.score == 8 }
            ];
            var extracted = notSoRandom(data, rules);
            expect(extracted).toBeInstanceOf(Array);
            expect(extracted).toHaveLength(3);
            expect(isInExtracted(extracted, "A")).toBeTruthy();
            expect(isInExtracted(extracted, "F")).toBeTruthy();
            expect(isInExtracted(extracted, "D")).toBeTruthy();
        });

        it("should fail", function() {
            var rules = [
                { count: 1, test: e => e.score > 7 },
                { count: 1, test: e => e.score > 8 },
                { count: 1, test: e => e.score > 9 }
            ];
            var f = function() {
                notSoRandom(data, rules);
            };
            expect(f).toThrow(Error);
        });

        it("should return 4 entries", function() {
            // This test aims at testing the internal ordering of rules
            // the last rule is more specific than the second, so rules should be reordered
            var rules = [
                { count: 2, test: e => e.score > 7 },
                { count: 1, test: e => e.score >= 0 },
                { count: 1, test: e => e.score < 3}
            ];
            var extracted = notSoRandom(data, rules);
            expect(extracted).toBeInstanceOf(Array);
            expect(extracted).toHaveLength(4);
        });
    });
});
