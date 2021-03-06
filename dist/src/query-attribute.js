/**
 * A class defining an attribute for a Query. Generally used
 * to alias an attribute from the source array data, but can also
 * be used to define an expression
 */
var QueryAttribute = /** @class */ (function () {
    function QueryAttribute(attributeName, alias, expression) {
        if (expression === void 0) { expression = null; }
        this.attributeName = attributeName;
        this.alias = alias || attributeName;
        this.expression = expression;
    }
    return QueryAttribute;
}());
export { QueryAttribute };
//# sourceMappingURL=query-attribute.js.map