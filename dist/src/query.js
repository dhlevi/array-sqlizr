import { QueryAttribute } from "./query-attribute";
import { parse, eval as expEval } from 'expression-eval';
/**
 * Base class for From and Where object. The query class
 * accepts your array data, and can return it via the 'select' function
 * Stand alone, this function is useful to alias attributes of
 * your array objects
 */
var Query = /** @class */ (function () {
    function Query(from) {
        this.fromArray = from;
    }
    /**
     * Fetch the Array of this query
     */
    Query.prototype.getQueryArray = function () {
        return this.fromArray;
    };
    /**
     * Returns an array containing only the desired attributes, aliased by the provided alias value
     * @param attributes The Select attributes and aliases
     * @returns Your final array
     */
    Query.prototype.select = function (attributes) {
        var _this = this;
        if (attributes === void 0) { attributes = null; }
        // Select *
        if (!attributes || attributes.length === 0) {
            return this.fromArray;
        }
        else {
            // if we have a string array, convert it to a QueryAttribute array
            if (typeof (attributes[0]) === 'string') {
                attributes = attributes.map(function (attString) { return new QueryAttribute(attString, attString); });
            }
            // only return the valid attributes, and use the alias!
            return this.fromArray.map(function (item) {
                var selectItem = {};
                for (var _i = 0, _a = attributes; _i < _a.length; _i++) {
                    var queryAttribute = _a[_i];
                    // Does the item have this exact attribute?
                    // If not, then we can check if we're looking for something deeper with a dot notation check
                    // Otherwise, we can ignore the attribute because we probably didn't find a match
                    var alias = queryAttribute.alias && queryAttribute.alias.length > 0 ? queryAttribute.alias : queryAttribute.attributeName;
                    if (queryAttribute.expression) {
                        // this is a derived attribute with a calculated expression
                        try {
                            var ast = parse(queryAttribute.expression);
                            var result = expEval(ast, item);
                            _this.setAttribute(selectItem, alias, result);
                        }
                        catch (err) {
                            _this.setAttribute(selectItem, alias, null);
                        }
                    }
                    else {
                        if (Object.prototype.hasOwnProperty.call(item, queryAttribute.attributeName)) {
                            _this.setAttribute(selectItem, alias, item[queryAttribute.attributeName]);
                        }
                        else if (queryAttribute.attributeName.includes('.')) {
                            _this.setAttribute(selectItem, alias, queryAttribute.attributeName.split('.').reduce(function (o, i) { return o[i]; }, item));
                        }
                        else {
                            _this.setAttribute(selectItem, alias, null);
                        }
                    }
                }
                return selectItem;
            });
        }
    };
    Query.prototype.setAttribute = function (obj, is, value) {
        if (typeof is == 'string') {
            return this.setAttribute(obj, is.split('.'), value);
        }
        else if (is.length == 1) {
            return obj[is[0]] = value;
        }
        else if (is.length == 0) {
            return obj;
        }
        else {
            if (!Object.prototype.hasOwnProperty.call(obj, is[0])) {
                obj[is[0]] = {};
            }
            return this.setAttribute(obj[is[0]], is.slice(1), value);
        }
    };
    return Query;
}());
export { Query };
//# sourceMappingURL=query.js.map