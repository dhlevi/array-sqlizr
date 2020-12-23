import { __extends, __spreadArrays } from "tslib";
import { Query } from './query';
/**
 * The Where class extends Query functions. Used as the "final" stage
 * of a SQLizr query, it can sort, limit, and inject unioned data. Additional
 * where clauses cannot be added
 * @extends Query
 */
var Where = /** @class */ (function (_super) {
    __extends(Where, _super);
    function Where() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Where.prototype.orderBy = function (compareFn, reverse) {
        if (reverse === void 0) { reverse = false; }
        if (!reverse) {
            return new Where(this.getQueryArray().sort(compareFn));
        }
        else {
            return new Where(this.getQueryArray().sort(compareFn).reverse());
        }
    };
    /**
     * Order the array in Ascending order
     * @param attribute the attribute to order by
    */
    Where.prototype.orderByAsc = function (attribute) {
        var attributeName = typeof (attribute) === 'string' ? attribute : attribute.attributeName;
        var sorted = __spreadArrays(this.getQueryArray()).sort(function (a, b) {
            var aVal = null;
            var bVal = null;
            if (Object.prototype.hasOwnProperty.call(a, attributeName)) {
                aVal = a[attributeName];
            }
            else if (attributeName.includes('.')) {
                aVal = attributeName.split('.').reduce(function (o, i) { return o[i]; }, a);
            }
            if (Object.prototype.hasOwnProperty.call(b, attributeName)) {
                bVal = a[attributeName];
            }
            else if (attributeName.includes('.')) {
                bVal = attributeName.split('.').reduce(function (o, i) { return o[i]; }, b);
            }
            if (!aVal || !bVal) {
                return 0;
            }
            else {
                return aVal > bVal ? 1 : -1;
            }
        });
        return new Where(sorted);
    };
    /**
     * Order the array in Descending order
     * @param attribute the attribute to order by
    */
    Where.prototype.orderByDesc = function (attribute) {
        return new Where(this.orderByAsc(attribute).getQueryArray().reverse());
    };
    /**
     * Limits the number of returned results by this amount. This will
     * immediately reduce the result count, so it's recommended to
     * do any sorting before limiting
     * @param limit
     */
    Where.prototype.limit = function (limit) {
        return new Where(this.getQueryArray().splice(0, limit));
    };
    /**
     * "Union" Two datasets together. This is just a wrapper around
     * Array.concat
     * @param unionedData The array you wish to concatenate into the current data
     */
    Where.prototype.union = function (unionedData) {
        return new Where(this.getQueryArray().concat(unionedData));
    };
    /**
     * Count of items in the array. Just a wrapper around Array.length
     */
    Where.prototype.count = function () {
        return this.getQueryArray().length;
    };
    /**
     * Calculate the sum of an attribute in your array
     * @param attribute The attribute to sum
     */
    Where.prototype.sum = function (attribute) {
        var attributeName = typeof (attribute) === 'string' ? attribute : attribute.attributeName;
        var result = 0;
        for (var _i = 0, _a = this.getQueryArray(); _i < _a.length; _i++) {
            var item = _a[_i];
            var val = 0;
            if (Object.prototype.hasOwnProperty.call(item, attributeName)) {
                val = item[attributeName];
            }
            else if (attributeName.includes('.')) {
                val = attributeName.split('.').reduce(function (o, i) { return o[i]; }, item);
            }
            if (typeof (val) === 'number') {
                result += val;
            }
        }
        return result;
    };
    /**
     * Calculate the average value of an attribute in your array
     * @param attribute the attribute to average
     */
    Where.prototype.average = function (attribute) {
        var sum = this.sum(attribute);
        return sum / this.getQueryArray().length;
    };
    return Where;
}(Query));
export { Where };
//# sourceMappingURL=where.js.map