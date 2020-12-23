"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SQLizr = void 0;
var tslib_1 = require("tslib");
var from_1 = require("./from");
var query_attribute_1 = require("./query-attribute");
/**
 * Root class for SQLizr. Doesn't really do much except allow you to start
 * a "From". This class should eventually have the ability to parse a SQL
 * string as well!
 */
var SQLizr = /** @class */ (function () {
    function SQLizr() {
    }
    SQLizr.from = function (array) {
        return new from_1.From(array);
    };
    /**
     * Parse a query string. Provide the query string (in SQL style), the "From" array, and an (in order)
     * list of join arrays
     * @example SELECT name, boss.name AS bossName, (wages.wage * 40) AS weeklyIncome FROM employees JOIN wages ON job = title WHERE active === true LIMIT 10 ORDER BY wage ASC
     * @param query The query string to parse
     * @param from The From array
     * @param joins The arrays to join (order in query assumed)
     * @param unions The arrays to union (order in query assumed)
     */
    SQLizr.parse = function (query, from, joins, unions) {
        if (joins === void 0) { joins = []; }
        if (unions === void 0) { unions = []; }
        var reversedJoins = tslib_1.__spreadArrays(joins).reverse();
        var reversedUnions = tslib_1.__spreadArrays(unions).reverse();
        var idxQuery = query.replace(/from/ig, '&@*FROM')
            .replace(/outer join/ig, '&@*OUTJN')
            .replace(/inner join/ig, '&@*INJN')
            .replace(/join/ig, '&@*JOIN')
            .replace(/where/ig, '&@*WHERE')
            .replace(/order by/ig, '&@*ORDRBY')
            .replace(/limit/ig, '&@*LIMIT')
            .replace(/union/ig, '&@*UNION')
            .trim();
        var parts = idxQuery.split('&@*');
        // From... should be obvious, and we can ignore it
        var queryFrom = new from_1.From(from);
        var whereClause = '';
        // Joins
        for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
            var part = parts_1[_i];
            if (part.toUpperCase().startsWith('JOIN') || part.toUpperCase().startsWith('OUTJN') || part.toUpperCase().startsWith('INJN')) {
                var joinArray = reversedJoins.pop();
                if (joinArray) {
                    // gnarly, but it works... 
                    var identifier = part.split(new RegExp('ON', 'i'))[0].substring(4).trim();
                    var fromAttribute = part.split(new RegExp('ON', 'i'))[1].split('=')[0].trim();
                    var joinAttribute = part.split(new RegExp('ON', 'i'))[1].split('=')[1].trim();
                    queryFrom = queryFrom.join(joinArray, identifier, fromAttribute, joinAttribute, part.toUpperCase().startsWith('INJN'));
                }
            }
            else if (part.toUpperCase().startsWith('WHERE')) {
                whereClause = part.split(new RegExp('WHERE', 'i'))[1].trim();
            }
        }
        var where = queryFrom.where(whereClause);
        // Any extra Where bits
        for (var _a = 0, parts_2 = parts; _a < parts_2.length; _a++) {
            var part = parts_2[_a];
            if (part.toUpperCase().startsWith('LIMIT')) {
                var limit = part.split(new RegExp('LIMIT', 'i'))[1].trim();
                where = where.limit(parseInt(limit));
            }
            else if (part.toUpperCase().startsWith('ORDRBY')) {
                var attribute = part.split(' ')[2];
                if (part.toUpperCase().includes('ASC')) {
                    where = where.orderByAsc(attribute);
                }
                else {
                    where = where.orderByDesc(attribute);
                }
            }
            else if (part.toUpperCase().startsWith('UNION')) {
                var union = reversedUnions.pop();
                if (union) {
                    where = where.union(union);
                }
            }
        }
        // parse the SELECT
        var select = [];
        for (var _b = 0, parts_3 = parts; _b < parts_3.length; _b++) {
            var part = parts_3[_b];
            if (part.toUpperCase().startsWith('SELECT') && part.toUpperCase().trim() !== 'SELECT *') {
                // SELECT name AS petName, owner.name AS ownerName
                var trimmedPart = part.trim().substring(6).trim();
                var clauses = trimmedPart.split(',');
                for (var _c = 0, clauses_1 = clauses; _c < clauses_1.length; _c++) {
                    var clause = clauses_1[_c];
                    var attributeAliases = clause.split(new RegExp('as', 'i'));
                    var attribute = attributeAliases[0].trim();
                    var alias = attributeAliases.length > 1 ? attributeAliases[1].trim() : attribute;
                    if (attribute.startsWith('(') && attribute.endsWith(')')) {
                        // expression parse
                        select.push(new query_attribute_1.QueryAttribute('expression', alias, attribute.substring(1, attribute.length - 1)));
                    }
                    else {
                        select.push(new query_attribute_1.QueryAttribute(attribute, alias));
                    }
                }
                break;
            }
        }
        // return the resulting array
        return where.select(select);
    };
    return SQLizr;
}());
exports.SQLizr = SQLizr;
//# sourceMappingURL=sqlizr.js.map