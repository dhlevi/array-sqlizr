import { deepCopy } from './deep-copy'
import { parse, eval as expEval } from 'expression-eval'
import { Query } from './query'
import { Where } from './where'
import { AssertPredicate } from 'assert'

/**
 * The From class extends Query functionality with the ability to
 * Join arrays together. Additionally, after joins are completed
 * you can execute a "Where" expression, which will convert the
 * from dataset into a Where dataset.
 * @extends Query
 */
export class From extends Query {
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
  public join (join: Array<any>, identifier: string, fromAttributeName: string, joinAttributeName: string, innerJoin = false): From {
    // merge the join array and the from array together, based on the attributes
    const joinedArray: Array<any> = []

    for (const item of this.getQueryArray()) {
      let foundJoin = false
      for (const joinItem of join) {
        if (item[fromAttributeName] === joinItem[joinAttributeName]) {
          foundJoin = true
          const joinedItem = deepCopy(item)
          joinedItem[identifier] = {}

          for (const att in joinItem) {
            if (Object.prototype.hasOwnProperty.call(joinItem, att)) {
              joinedItem[identifier][att] = joinItem[att]
            }
          }

          joinedArray.push(joinedItem)
        }
      }
      // If it's an outer join and we haven't found a match, we should
      // add the record with a null identifier attribute.
      if (!innerJoin && !foundJoin) {
        const joinedItem = deepCopy(item)
        joinedItem[identifier] = null
        joinedArray.push(joinedItem)
      }
    }

    return new From(joinedArray)
  }

  /**
   * Uses the expression-eval library to evaluate an epxression. This does
   * not at any point execute an eval() statement, however you should be
   * cautious with any expression evaluation.
   * Your expression must result in a boolean, ie: 'attribute === 42'
   * You can pass in null to return all results without evaluating
   * @param expression An expression
   */
  public where (expression: string | null = null): Where {
    if (expression && expression.length > 0) {
      const passed: Array<any> = []
      const ast = parse(expression)
      for (const item of this.getQueryArray()) {
        try {
          const result = expEval(ast, item)
          if (result) {
            passed.push(deepCopy(item))
          }
        } catch (err) {
          // failed to evaluate expression, usually a bad attribute value, or missing attribute from a join
          console.error(err)
        }
      }
      return new Where(passed)
    } else {
      return new Where(this.getQueryArray())
    }
  }

  /**
   * A wrapper around the default Array.filter function. An
   * alternative to using the where expression evaluate function
   * @param predicate Your filter function
   */
  public whereFilter (predicate: (value: any, index: number, array: any[]) => unknown): Where {
    return new Where(this.getQueryArray().filter(predicate))
  }
}
