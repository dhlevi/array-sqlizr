import { __awaiter, __generator } from "tslib";
import { SQLizr } from "../src/sqlizr";
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
    it('Test simple From', function () { return __awaiter(void 0, void 0, void 0, function () {
        var results;
        return __generator(this, function (_a) {
            results = SQLizr.from(pets).select();
            expect(results.length).toBe(pets.length);
            console.log(results);
            // useless return the whole array
            results = SQLizr.from(pets).select(['name', 'owner.name', 'age']);
            console.log(results);
            expect(results.length).toBe(pets.length);
            // select/alias some attributes to return, test null and expression
            results = SQLizr.from(pets).select([{ attributeName: 'name', alias: 'petName', expression: null },
                { attributeName: 'owner.name', alias: 'ownerName', expression: null },
                { attributeName: 'notfound', alias: 'notfound', expression: null },
                { attributeName: 'expression', alias: 'expression', expression: 'owner.age + age' }]);
            expect(results.length).toBe(pets.length);
            // should have an aliased attribute
            expect(Object.prototype.hasOwnProperty.call(results[0], 'petName')).toBeTruthy();
            return [2 /*return*/];
        });
    }); });
    it('Test inner and outer Join', function () { return __awaiter(void 0, void 0, void 0, function () {
        var results, ojResults, whereResults;
        return __generator(this, function (_a) {
            results = SQLizr.from(pets).join(sauce, 'sauce', 'breed', 'pairsWith', true).select();
            // should only have a single matched result
            expect(results.length).toBe(1);
            // should have a 'sauce' attribute with the Bat sauce. Yum!
            expect(results[0].sauce.pairsWith).toBe('Bat');
            ojResults = SQLizr.from(pets).join(sauce, 'sauce', 'breed', 'pairsWith').select();
            expect(ojResults.length).toBe(pets.length);
            whereResults = SQLizr.from(pets).join(sauce, 'sauce', 'breed', 'pairsWith').where('sauce.name === "Lemon"').select();
            expect(whereResults.length).toBe(1);
            return [2 /*return*/];
        });
    }); });
    it('Test where expression evaluation', function () { return __awaiter(void 0, void 0, void 0, function () {
        var results;
        return __generator(this, function (_a) {
            results = SQLizr.from(pets).where('breed === "Dog" || age < 6').select();
            expect(results.length).toBe(2);
            return [2 /*return*/];
        });
    }); });
    it('Test where filter evaluation', function () { return __awaiter(void 0, void 0, void 0, function () {
        var results;
        return __generator(this, function (_a) {
            results = SQLizr.from(pets).whereFilter(function (pet) { return pet.breed === 'Dog' || pet.age < 6; }).select();
            expect(results.length).toBe(2);
            return [2 /*return*/];
        });
    }); });
    it('Test where sort, limit', function () { return __awaiter(void 0, void 0, void 0, function () {
        var descResults, ascResults;
        return __generator(this, function (_a) {
            descResults = SQLizr.from(pets).where().orderByDesc('breed').limit(1).select();
            expect(descResults.length).toBe(1);
            expect(descResults[0].breed).toBe('Dog');
            ascResults = SQLizr.from(pets).where().orderByAsc('owner.age').limit(1).select();
            expect(ascResults.length).toBe(1);
            expect(ascResults[0].breed).toBe('Bat');
            // boolean
            ascResults = SQLizr.from(pets).where().orderByAsc('edible').limit(1).select();
            expect(ascResults.length).toBe(1);
            expect(ascResults[0].breed).toBe('Bat');
            return [2 /*return*/];
        });
    }); });
    it('Test union', function () { return __awaiter(void 0, void 0, void 0, function () {
        var results;
        return __generator(this, function (_a) {
            results = SQLizr.from(pets).where().union(sauce).select();
            expect(results.length).toBe(6);
            return [2 /*return*/];
        });
    }); });
});
//# sourceMappingURL=sqlizr.test.js.map