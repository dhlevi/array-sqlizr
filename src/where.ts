import { QueryAttribute } from "./query-attribute"
import { Query } from './query'

/**
 * The Where class extends Query functions. Used as the "final" stage
 * of a SQLizr query, it can sort, limit, and inject unioned data. Additional
 * where clauses cannot be added
 * @extends Query
 */
export class Where extends Query {
  public orderBy (compareFn?: (a: any, b: any) => number, reverse = false): Where {
    if (!reverse) {
      return new Where(this.getQueryArray().sort(compareFn))
    } else {
      return new Where(this.getQueryArray().sort(compareFn).reverse())
    }
  }
  /**
   * Order the array in Ascending order
   * @param attribute the attribute to order by
  */
  public orderByAsc (attribute: QueryAttribute | string): Where {
    const attributeName = typeof(attribute) === 'string' ? attribute : attribute.attributeName
    const sorted = [...this.getQueryArray()].sort((a, b) => {
      let aVal = null
      let bVal = null

      if (Object.prototype.hasOwnProperty.call(a, attributeName)) {
        aVal = a[attributeName]
      } else if (attributeName.includes('.')) {
        aVal = attributeName.split('.').reduce((o, i) => o[i], a)
      }

      if (Object.prototype.hasOwnProperty.call(b, attributeName)) {
        bVal = a[attributeName]
      } else if (attributeName.includes('.')) {
        bVal = attributeName.split('.').reduce((o, i) => o[i], b)
      }

      if (!aVal || !bVal) {
        return 0
      } else {
        return aVal > bVal ? 1 : -1
      }
    })

    return new Where(sorted)
  }

  /**
   * Order the array in Descending order
   * @param attribute the attribute to order by
  */
  public orderByDesc (attribute: QueryAttribute | string): Where {
    return new Where (this.orderByAsc(attribute).getQueryArray().reverse())
  }

  /**
   * Limits the number of returned results by this amount. This will
   * immediately reduce the result count, so it's recommended to 
   * do any sorting before limiting
   * @param limit 
   */
  public limit (limit: number): Where {
    return new Where(this.getQueryArray().splice(0, limit))
  }

  /**
   * "Union" Two datasets together. This is just a wrapper around
   * Array.concat
   * @param unionedData The array you wish to concatenate into the current data
   */
  public union (unionedData: Array<any>): Where {
    return new Where(this.getQueryArray().concat(unionedData))
  }

  /**
   * Count of items in the array. Just a wrapper around Array.length
   */
  public count (): number {
    return this.getQueryArray().length
  }

  /**
   * Calculate the sum of an attribute in your array
   * @param attribute The attribute to sum
   */
  public sum (attribute: QueryAttribute | string): number {
    const attributeName = typeof(attribute) === 'string' ? attribute : attribute.attributeName
    let result = 0
    for (const item of this.getQueryArray()) {
      let val = 0
      if (Object.prototype.hasOwnProperty.call(item, attributeName)) {
        val = item[attributeName]
      } else if (attributeName.includes('.')) {
        val = attributeName.split('.').reduce((o, i) => o[i], item)
      }

      if (typeof(val) === 'number') {
        result += val
      }
    }

    return result
  }

  /**
   * Calculate the average value of an attribute in your array
   * @param attribute the attribute to average
   */
  public average (attribute: QueryAttribute | string): number {
    const sum = this.sum(attribute)
    return sum / this.getQueryArray().length
  }
}
