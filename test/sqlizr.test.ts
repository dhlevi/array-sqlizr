import { SQLizr } from "../src/sqlizr"

const pets = [
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
]

const sauce = [
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
]
describe('sqlizr.ts', () => {
  it('Test simple From', async () => {
    // useless return the whole array
    let results = SQLizr.from(pets).select()
    expect(results.length).toBe(pets.length)
    // useless return the whole array
    results = SQLizr.from(pets).select(['name', 'owner.name', 'age'])
    expect(results.length).toBe(pets.length)

    // select/alias some attributes to return, test null and expression
    results = SQLizr.from(pets).select([{ attributeName: 'name', alias: 'petName', expression: null },
                                        { attributeName: 'owner.name', alias: 'ownerName', expression: null },
                                        { attributeName: 'notfound', alias: 'notfound', expression: null },
                                        { attributeName: 'expression', alias: 'expression', expression: 'owner.age + age' }])

    expect(results.length).toBe(pets.length)
    // should have an aliased attribute
    expect(Object.prototype.hasOwnProperty.call(results[0], 'petName')).toBeTruthy()
  })
  it('Test inner and outer Join', async () => {
    // join pets and sauce, inner join
    const results = SQLizr.from(pets).join(sauce, 'sauce', 'breed', 'pairsWith', true).select()

    // should only have a single matched result
    expect(results.length).toBe(1)
    // should have a 'sauce' attribute with the Bat sauce. Yum!
    expect(results[0].sauce.pairsWith).toBe('Bat')

    // outer join, so will return everything!
    const ojResults = SQLizr.from(pets).join(sauce, 'sauce', 'breed', 'pairsWith').select()
    expect(ojResults.length).toBe(pets.length)

    // where clause test for joined attributes
    const whereResults = SQLizr.from(pets).join(sauce, 'sauce', 'breed', 'pairsWith').where('sauce.name === "Lemon"').select()
    expect(whereResults.length).toBe(1)
  })
  it('Test where expression evaluation', async () => {
    // useless return the whole array
    const results = SQLizr.from(pets).where('breed === "Dog" || age < 6').select()
    expect(results.length).toBe(2)
  })
  it('Test where filter evaluation', async () => {
    // useless return the whole array
    const results = SQLizr.from(pets).whereFilter(pet => pet.breed === 'Dog' || pet.age < 6).select()
    expect(results.length).toBe(2)
  })
  it('Test where sort, limit', async () => {
    // string
    const descResults = SQLizr.from(pets).where().orderByDesc('breed').limit(1).select()
    expect(descResults.length).toBe(1)
    expect(descResults[0].breed).toBe('Dog')

    // number
    let ascResults = SQLizr.from(pets).where().orderByAsc('owner.age').limit(1).select()
    expect(ascResults.length).toBe(1)
    expect(ascResults[0].breed).toBe('Bat')

    // boolean
    ascResults = SQLizr.from(pets).where().orderByAsc('edible').limit(1).select()
    expect(ascResults.length).toBe(1)
    expect(ascResults[0].breed).toBe('Bat')
  })
  it('Test union', async () => {
    const results = SQLizr.from(pets).where().union(sauce).select()
    expect(results.length).toBe(6)
  })
})
