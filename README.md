# Array SQLizr

## What is it?

Have you ever found that working with Arrays in Javascript was a little too straightforward and easy? Do you wish you could make it unnecessarily complicated? Then this is the library for you!

SQLizr is a utility that lets you work with Javascript arrays in a more SQL like way, by chaining From, Join, and Select objects together to form a new array based on queries from a source (or set of source) arrays. It works with arrays of objects, not primitives, so it's extra unhelpful for simple tasks.

SQLizr trys to be non-destructive to your base array, and will always return cloned representations of your objects where possible.

And yes, Typescript definitions are included!

## Installation

```bash
npm -i array-sqlizr
```

## Un-installation (usually followed shortly after installation)

```bash
npm r array-sqlizr
```

## How to use

General usage is very straightforward:

### Basic (useless) example
```typescript
const myCoolArray = []
// just return the same array.
// SELECT * FROM myCoolArray
const myNewArray = SQLizr.from(myCoolArray).select()
```

You can of course do more than just that useless example above. For instance, actually selecting attributes to output:

### Using Query Attributes

```typescript
const myCoolArray = [
  { 
    name: { first: 'Jim', last: 'Jam'}, 
    age: 21
  }, 
  {
    name: { first: 'Bill', last: 'Smith'}, 
    age: 62
  }]

// SELECT name.first AS firstName, name.last AS lastName FROM myCoolAray
const myNewArray = SQLizr.from(myCoolArray).select([new QueryAttribute('name.first', 'firstName'), new QueryAttribute('name.last', 'lastName')])

/* result
  [{
    firstName: 'Jim',
    lastName: 'Jam'
  },{
    firstName: 'Bill',
    lastName: 'Smith'
  }]
*/
```

If you don't want to alias your attribute values, you can pass in an array of strings instead of `QueryAttribute` objects.

```typescript
const myCoolArray = [
  { 
    name: { first: 'Jim', last: 'Jam'}, 
    age: 21
  }, 
  {
    name: { first: 'Bill', last: 'Smith'}, 
    age: 62
  }]

// SELECT name.first AS firstName, name.last AS lastName FROM myCoolAray
const myNewArray = SQLizr.from(myCoolArray).select(['name.first', 'name.last'])

/* result
  [{
    name: { 
      first: 'Jim',
      last: 'Jam'
    }
  },{
    name: {
      first: 'Bill',
      last: 'Smith'
    }
  }]
*/
```

### Joins

You can join to other arrays as well. Join syntax works like SQL joins:

```typescript
.join(array, arrayName, fromAttribute, joinAttribute, innerJoin)
```

The `arrayName` is the identifier that you can use to refer to joined attributes. All joined attributes will be found under that identifier.

`fromAttribute` and `joinAttribute` are the attributes to use for finding a match. Only matches will append to the `from` array's items.

`innerJoin` is a boolean that determines if the join should be an inner join. This defaults to false, and the default behaviour is an outer join.

```typescript
const employees = [
  { 
    name: { first: 'Jim', last: 'Jam'}, 
    age: 21,
    job: 'Mechanic'
  }, 
  {
    name: { first: 'Bill', last: 'Smith'}, 
    age: 62,
    job: 'CEO'
  }]

const wages = [
{ 
  job: 'Mechanic',
  wagePerHour: 25.00
},{
  job: 'CEO',
  wagePerHour: 50.00
},{
  job: 'Janitor',
  wagePerHour: 37.23
}]

// SELECT ... FROM employees JOIN wages w ON wages.job = job
const myNewArray = SQLizr.from(employees)
                          .join(wages, 'w', 'job', 'job')
                          .select([new QueryAttribute('name.first', 'firstName'),
                                   new QueryAttribute('name.last', 'lastName'),
                                   new QueryAttribute('w.wagePerHour', 'wage')])

/* result
  [{
    firstName: 'Jim',
    lastName: 'Jam',
    wage: 25.00
  },{
    firstName: 'Bill',
    lastName: 'Smith',
    wage: 50.00
  }]
*/
```

### Where?

Of course you can supply a `where` clause. There are two methods for executing a where clause; `where` and `whereFilter`

```typescript
.where('expression')
.whereFilter(myFilterFunction)
```

The default `where` evaluates a provided expression, and returns matching results. Your expression should obviously evaluate as a boolean. Note that this does not use `eval` in the code, but instead uses the [expression-eval](https://www.npmjs.com/package/expression-eval) library (which itself uses [jsep](https://www.npmjs.com/package/jsep)). Running evaluated expressions always contains an element of risk. Ensure your expressions aren't going to attempt to execute something you wouldn't want executed!

```typescript
const people = [
  { 
    name: { first: 'Jim', last: 'Jam'}, 
    age: 21
  }, 
  {
    name: { first: 'Bill', last: 'Smith'}, 
    age: 62
  }]
// SELECT * FROM people WHERE name.first = "Jim"
const myNewArray = SQLizr.from(people)
                         .where('name.first === "Jim"')
                         .select()

/* result
  [{ 
    name: { first: 'Jim', last: 'Jam'}, 
    age: 21
  }]
*/
```

Alternatively, you can use `whereFilter`, which is simply a wrapper around the `Array.filter()` method.

```typescript
const myNewArray = SQLizr.from(people)
                         .whereFilter(person => person.name.first === 'Jim')
                         .select()

/* result
  [{ 
    name: { first: 'Jim', last: 'Jam'}, 
    age: 21
  }]
*/
```

Finally, you can include an empty `where` if you dont want to filter your array at all, and want to jump straight on to `where` object functions

### Where object functions: Order By, Limit, Sum, Average, and Union

Once you've executed a `where`, you can further refine your array by sorting, or limiting results. `OrderByAsc` and `OrderByDesc` are wrappers around the Array.sort method. There's also a a simple `OrderBy` that is a direct wrap of Sort, allowing you to pass in your own sorting function.

The `limit` function reduces your results to a specified number.

The `union` function wraps the `Array.concat` method, and simply merges two arrays together. Mostly useful when the objects in the arrays have matching models!

`sum` and `average` are utility functions that can calculate and return the sum or average value of a supplied attribute. 

## QueryAttribute expressions

A final `select` contains an array of QueryAttributes. These are usually the attribute name, and an alias that you want to use for it. However, you can also supply an expression that can be added to your result.

Expression evaluation is done via the same method as where clause expression evaluation.

```typescript
// SELECT (name.first.length + name.last.length) as nameCharacterCount FROM people
const myNewArray = SQLizr.from(people)
                         .where()
                         .select([{ attributeName: 'expression', alias: 'nameCharacterCount', expression: 'name.first.length + name.last.length'}])

/* result
  [{ 
    nameCharacterCount: 6
  },{ 
    nameCharacterCount: 9
  }]
*/
```

## Parsing a SQLish String

You can also parse a SQLish string, instead of using the syntax above. The string parsing is still fairly basic; complex queries aren't quite supported yet, but you can do the basics. Inline queries within a string can't be done, but you can supply other parsed queries as your from, join, or union arrays. Should go without saying, but avoid using reserved words as attribute names, alias names, join identifiers, etc. or things will go weird quickly. Specifically don't use the following (case insensitive!):

- SELECT
- FROM
- OUTER
- INNER
- JOIN
- ON
- WHERE
- LIMIT
- ORDER BY
- ASC
- DSC
- UNION

How to use the parser:

```typescript
SQLizr.parse(queryString, fromArray, [joinArrays], [unionArrays])
```

Example:

```typescript
const result = SQLizr.parse('SELECT name, boss.name AS bossName, (wages.wage * 40) AS weeklyIncome FROM employees JOIN wages ON job = title WHERE active === true LIMIT 10 ORDER BY wage ASC', employees, [wages])
```

### Select

Your `select` clause can contains attribute names, aliases, and basic expressions (which must have an alias). Expressions must be wrapped in brackets.

### From

Can be more or less ignored, but it's nice to keep the syntax consistent. `From` will be derived by the array you pass into the parse function. The supplied name doesn't actually do anything!

### Join

Supply joins by specifying a join name and ON expression, like `JOIN wages ON job = title`. The name will be used as your join identifier. The expression follows a specific syntax of `fromAttribute` = `joinAttribute`. So in the example, it will match where `job` on the from array items equals `title` on the wages array items. The `=` sign is used as a delimiter, so don't leave it out!

By default, Joins are outer joins, but you can specify `OUTER JOIN` for outer joins, and `INNER JOIN` to perform an inner join.

The `SQLizr.parse` function will use the supplied array of arrays in the `joins` parameter. Because there's no name/id matching, it goes in order, so your first array on that parameter will be used for your first join, etc. So make sure you put things on in the correct order you need!

### Where

Uses a where expression. See documentation above

### Unions

You bet. The `SQLizr.parse` function will use the supplied array of arrays in the `unions` parameter. Works in the same way as the `joins` parameter

## Why would you release this abomination unto the world?

Sometimes you spend so much time wondering if you could do something, you don't stop to wonder if you should...

## Thanks!
