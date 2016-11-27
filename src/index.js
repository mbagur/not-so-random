/**
 * store computations to decide in which order to run
 * random extraction rules to have the highest chance not to
 * run in a situation where a rule cannot be satisfied
 */
var rulesContext = {};

/**
 * store order to run the rules
 */
var order = [];

/**
 * array subtract
 * removes from arr1 items that are in arr2
 * @param Array arr1
 * @param Array arr2
 * @return Array  arr1 - arr2
 */
function arraySubtract(arr1, arr2) {
    return arr1.filter(function(elt) {
        return arr2.indexOf(elt) < 0;
    })
}

function prepare(data, rules) {
    for(var i=0;i<rules.length;++i) {
        var possibles = data.filter(rules[i].test);
        rulesContext[i] = {
            possibles: possibles,
            exclusives: possibles,
            count: rules[i].count
        };
    }

    for(var i=0;i<rules.length;++i) {
        for(var j=0;j<rules.length;++j) {
            if (i!=j) {
                rulesContext[i].exclusives = arraySubtract(
                    rulesContext[i].exclusives,
                    rulesContext[j].possibles
                );
            }
        }
        rulesContext[i].trustScore =
            rulesContext[i].exclusives.length - rulesContext[i].count;
        if(order.length==0 || order[0].trustScore >= rulesContext[i].trustScore) {
            order.splice(0, 0, {i: i, trustScore: rulesContext[i].trustScore});
        } else if( order[order.length-1].trustScore <= rulesContext[i].trustScore) {
            order.push({i: i, trustScore: rulesContext[i].trustScore});
        } else {
            for(var k=0;k<order.length-1;k++) {
                if(
                    order[k].trustScore <= rulesContext[i].trustScore &&
                    order[k+1].trustScore >= rulesContext[i].trustScore
                ) {
                    order.splice(k, 0, {i: i, trustScore: rulesContext[i].trustScore});
                    break;
                }
            }
        }
    }
}

function extract(data, rules) {
    var extracted = [];
    order.forEach(function(o) {
        var ruleContext = rulesContext[o.i];
        extracted.forEach(function(elt) {
            var idx = ruleContext.possibles.indexOf(elt);
            if (idx>=0) {
                ruleContext.possibles.splice(idx,1);
            }
        });
        for(var j=0;j<ruleContext.count;++j) {
            if(ruleContext.possibles.length == 0) {
                throw new Error('Impossible to extract enough matches for rule '+o.i);
            }
            var idx = Math.floor(Math.random()*ruleContext.possibles.length);
            var elt = ruleContext.possibles[idx];
            extracted.push(elt);
            ruleContext.possibles.splice(idx,1);
        }
    });

    return extracted;
}

/**
 * extract random members of an array
 * respecting the rules given in parameter
 *
 * rules : [
 *      {
 *          count: 2,
 *          test: function(member) { return bool; }
 *      }
 * ]
 *
 * @param array  data   the data from which to extract random members
 * @return array        randomly extracted members of data parameter
 */
function extractMembers(data, rules) {
    rulesContext = {};
    order = [];
    prepare(data, rules);
    return extract(data, rules);
}

export default extractMembers;
