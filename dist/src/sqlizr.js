import { From } from "./from";
/**
 * Root class for SQLizr. Doesn't really do much except allow you to start
 * a "From". This class should eventually have the ability to parse a SQL
 * string as well?
 */
var SQLizr = /** @class */ (function () {
    function SQLizr() {
    }
    SQLizr.from = function (array) {
        return new From(array);
    };
    return SQLizr;
}());
export { SQLizr };
//# sourceMappingURL=sqlizr.js.map