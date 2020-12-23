"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var sqlizr_1 = require("../src/sqlizr");
var pets = [
    {
        name: 'Jack',
        breed: 'Dog',
        owner: { name: 'Jimbo', age: 62 },
        age: 12,
        edible: false
    },
    {
        name: 'Jill',
        breed: 'Cat',
        owner: { name: 'Jimbo', age: 62 },
        age: 6,
        edible: false
    },
    {
        name: 'Drac',
        breed: 'Bat',
        owner: { name: 'Henrietta', age: 26 },
        age: 2,
        edible: true
    }
];
var sauce = [
    {
        name: 'Hot Sauce',
        pairsWith: 'Burritos',
        cost: 2.55
    },
    {
        name: 'Worchestershire',
        pairsWith: 'Roast',
        cost: 6.99
    },
    {
        name: 'Lemon',
        pairsWith: 'Bat',
        cost: 1.15
    }
];
describe('sqlizr.ts', function () {
    it('Test simple From', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var results;
        return tslib_1.__generator(this, function (_a) {
            results = sqlizr_1.SQLizr.from(pets).select();
            expect(results.length).toBe(pets.length);
            // useless return the whole array
            results = sqlizr_1.SQLizr.from(pets).select(['name', 'owner.name', 'age']);
            expect(results.length).toBe(pets.length);
            // select/alias some attributes to return, test null and expression
            results = sqlizr_1.SQLizr.from(pets).select([{ attributeName: 'name', alias: 'petName', expression: null },
                { attributeName: 'owner.name', alias: 'ownerName', expression: null },
                { attributeName: 'notfound', alias: 'notfound', expression: null },
                { attributeName: 'expression', alias: 'expression', expression: 'owner.age + age' }]);
            expect(results.length).toBe(pets.length);
            // should have an aliased attribute
            expect(Object.prototype.hasOwnProperty.call(results[0], 'petName')).toBeTruthy();
            return [2 /*return*/];
        });
    }); });
    it('Test inner and outer Join', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var results, ojResults, whereResults;
        return tslib_1.__generator(this, function (_a) {
            results = sqlizr_1.SQLizr.from(pets).join(sauce, 'sauce', 'breed', 'pairsWith', true).select();
            // should only have a single matched result
            expect(results.length).toBe(1);
            // should have a 'sauce' attribute with the Bat sauce. Yum!
            expect(results[0].sauce.pairsWith).toBe('Bat');
            ojResults = sqlizr_1.SQLizr.from(pets).join(sauce, 'sauce', 'breed', 'pairsWith').select();
            expect(ojResults.length).toBe(pets.length);
            whereResults = sqlizr_1.SQLizr.from(pets).join(sauce, 'sauce', 'breed', 'pairsWith').where('sauce.name === "Lemon"').select();
            expect(whereResults.length).toBe(1);
            return [2 /*return*/];
        });
    }); });
    it('Test where expression evaluation', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var results;
        return tslib_1.__generator(this, function (_a) {
            results = sqlizr_1.SQLizr.from(pets).where('breed === "Dog" || age < 6').select();
            expect(results.length).toBe(2);
            return [2 /*return*/];
        });
    }); });
    it('Test where filter evaluation', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var results;
        return tslib_1.__generator(this, function (_a) {
            results = sqlizr_1.SQLizr.from(pets).whereFilter(function (pet) { return pet.breed === 'Dog' || pet.age < 6; }).select();
            expect(results.length).toBe(2);
            return [2 /*return*/];
        });
    }); });
    it('Test where sort, limit', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var descResults, ascResults;
        return tslib_1.__generator(this, function (_a) {
            descResults = sqlizr_1.SQLizr.from(pets).where().orderByDesc('breed').limit(1).select();
            expect(descResults.length).toBe(1);
            expect(descResults[0].breed).toBe('Dog');
            ascResults = sqlizr_1.SQLizr.from(pets).where().orderByAsc('owner.age').limit(1).select();
            expect(ascResults.length).toBe(1);
            expect(ascResults[0].breed).toBe('Bat');
            // boolean
            ascResults = sqlizr_1.SQLizr.from(pets).where().orderByAsc('edible').limit(1).select();
            expect(ascResults.length).toBe(1);
            expect(ascResults[0].breed).toBe('Bat');
            // order by expression, reversed
            descResults = sqlizr_1.SQLizr.from(pets).where().orderBy(function (a, b) { return a.age > b.age ? 1 : -1; }).select();
            ascResults = sqlizr_1.SQLizr.from(pets).where().orderBy(function (a, b) { return a.age < b.age ? 1 : -1; }, true).select();
            expect(ascResults.length).toBe(3);
            expect(ascResults[0].breed).toBe('Bat');
            expect(descResults[0].breed).toBe(ascResults[0].breed);
            return [2 /*return*/];
        });
    }); });
    it('Test union', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var results;
        return tslib_1.__generator(this, function (_a) {
            results = sqlizr_1.SQLizr.from(pets).where().union(sauce).select();
            expect(results.length).toBe(6);
            return [2 /*return*/];
        });
    }); });
    it('Test parse', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var result;
        return tslib_1.__generator(this, function (_a) {
            result = sqlizr_1.SQLizr.parse('SELECT name AS petName, owner.name AS ownerName, (age * 7) AS humanAge FROM pets INNER JOIN sauce ON breed = pairsWith WHERE edible === true LIMIT 1 ORDER BY breed ASC', pets, [sauce]);
            expect(result.length).toBe(1);
            expect(result[0].petName).toBe('Drac');
            expect(result[0].ownerName).toBe('Henrietta');
            return [2 /*return*/];
        });
    }); });
    it('Test Sum, Average', function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var sum, avg;
        return tslib_1.__generator(this, function (_a) {
            sum = sqlizr_1.SQLizr.from(pets).where().sum('age');
            avg = sqlizr_1.SQLizr.from(pets).where().average('owner.age');
            expect(sum).toBe(20);
            expect(avg).toBe(50);
            return [2 /*return*/];
        });
    }); });
});
//# sourceMappingURL=sqlizr.test.js.map