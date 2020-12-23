import { __extends } from "tslib";
import { deepCopy } from './deep-copy';
import { parse, eval as expEval } from 'expression-eval';
import { Query } from './query';
import { Where } from './where';
/**
 * The From class extends Query functionality with the ability to
 * Join arrays together. Additionally, after joins are completed
 * you can execute a "Where" expression, which will convert the
 * from dataset into a Where dataset.
 * @extends Query
 */
var From = /** @class */ (function (_super) {
    __extends(From, _super);
    function From() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Join this array to another array. Require a join identifier, which will
     * match the joined values. If you have multiple joins, this may duplicate
     * records on the "from" side
     * @param join The array to join
     * @param identifier The identifier to use for the joined objects
     * @param fromAttributeName the From array attribute to match on
     * @param joinAttributeName the join array attribute to match on
     * @param innerJoin Defaults to false (outer join), set to true to perform an inner join (exclude nulls from from)
     * @returns A new "From" object containing the resulting join
     */
    From.prototype.join = function (join, identifier, fromAttributeName, joinAttributeName, innerJoin) {
        if (innerJoin === void 0) { innerJoin = false; }
        // merge the join array and the from array together, based on the attributes
        var joinedArray = [];
        for (var _i = 0, _a = this.getQueryArray(); _i < _a.length; _i++) {
            var item = _a[_i];
            var foundJoin = false;
            for (var _b = 0, join_1 = join; _b < join_1.length; _b++) {
                var joinItem = join_1[_b];
                if (item[fromAttributeName] === joinItem[joinAttributeName]) {
                    foundJoin = true;
                    var joinedItem = deepCopy(item);
                    joinedItem[identifier] = {};
                    for (var att in joinItem) {
                        if (Object.prototype.hasOwnProperty.call(joinItem, att)) {
                            joinedItem[identifier][att] = joinItem[att];
                        }
                    }
                    joinedArray.push(joinedItem);
                }
            }
            // If it's an outer join and we haven't found a match, we should
            // add the record with a null identifier attribute.
            if (!innerJoin && !foundJoin) {
                var joinedItem = deepCopy(item);
                joinedItem[identifier] = null;
                joinedArray.push(joinedItem);
            }
        }
        return new From(joinedArray);
    };
    /**
     * Uses the expression-eval library to evaluate an epxression. This does
     * not at any point execute an eval() statement, however you should be
     * cautious with any expression evaluation.
     * Your expression must result in a boolean, ie: 'attribute === 42'
     * You can pass in null to return all results without evaluating
     * @param expression An expression
     */
    From.prototype.where = function (expression) {
        if (expression === void 0) { expression = null; }
        if (expression && expression.length > 0) {
            var passed = [];
            var ast = parse(expression);
            for (var _i = 0, _a = this.getQueryArray(); _i < _a.length; _i++) {
                var item = _a[_i];
                try {
                    var result = expEval(ast, item);
                    if (result) {
                        passed.push(deepCopy(item));
                    }
                }
                catch (err) {
                    // failed to evaluate expression, usually a bad attribute value, or missing attribute from a join
                    console.error(err);
                }
            }
            return new Where(passed);
        }
        else {
            return new Where(this.getQueryArray());
        }
    };
    /**
     * A wrapper around the default Array.filter function. An
     * alternative to using the where expression evaluate function
     * @param predicate Your filter function
     */
    From.prototype.whereFilter = function (predicate) {
        return new Where(this.getQueryArray().filter(predicate));
    };
    return From;
}(Query));
export { From };
//# sourceMappingURL=from.js.map