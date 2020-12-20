import { QueryAttribute } from "./query-attribute"
import { parse, eval as expEval } from 'expression-eval'
/**
 * Base class for From and Where object. The query class
 * accepts your array data, and can return it via the 'select' function
 * Stand alone, this function is useful to alias attributes of
 * your array objects
 */
export class Query {
  private fromArray: Array<any>

  constructor (from: Array<any>) {
    this.fromArray = from
  }

  /**
   * Fetch the Array of this query
   */
  protected getQueryArray (): Array<any> {
    return this.fromArray
  }

  /**
   * Returns an array containing only the desired attributes, aliased by the provided alias value
   * @param attributes The Select attributes and aliases
   * @returns Your final array
   */
  public select (attributes: string[] | QueryAttribute[] | null = null): Array<any> {
    // Select *
    if (!attributes || attributes.length === 0) {
      return this.fromArray
    } else {

      // if we have a string array, convert it to a QueryAttribute array
      if (typeof(attributes[0]) === 'string') {
        attributes = (attributes as string[]).map((attString: string) => new QueryAttribute(attString, attString))
      }

      // only return the valid attributes, and use the alias!
      return this.fromArray.map(item => {
        const selectItem: any = {}
        for (const queryAttribute of (attributes as QueryAttribute[])) {
          // Does the item have this exact attribute?
          // If not, then we can check if we're looking for something deeper with a dot notation check
          // Otherwise, we can ignore the attribute because we probably didn't find a match
          const alias = queryAttribute.alias && queryAttribute.alias.length > 0 ? queryAttribute.alias : queryAttribute.attributeName

          if (queryAttribute.expression) {
            // this is a derived attribute with a calculated expression
            try {
              const ast = parse(queryAttribute.expression)
              const result = expEval(ast, item)
              this.setAttribute(selectItem, alias, result)
            } catch(err) {
              this.setAttribute(selectItem, alias, null)
            }
          } else {
            if (Object.prototype.hasOwnProperty.call(item, queryAttribute.attributeName)) {
              this.setAttribute(selectItem, alias, item[queryAttribute.attributeName])
            } else if (queryAttribute.attributeName.includes('.')) {
              this.setAttribute(selectItem, alias, queryAttribute.attributeName.split('.').reduce((o, i) => o[i], item))
            } else {
              this.setAttribute(selectItem, alias, null)
            }
          }
        }
        return selectItem
      })
    }
  }

  private setAttribute (obj: any, is: string | string[], value: any): any {
    if (typeof is == 'string') {
      return this.setAttribute(obj, is.split('.'), value)
    } else if (is.length == 1) {
      return obj[is[0]] = value
    } else if (is.length == 0) {
      return obj
    } else {

      if (!Object.prototype.hasOwnProperty.call(obj, is[0])) {
        obj[is[0]] = {}
      }

      return this.setAttribute(obj[is[0]], is.slice(1), value)
    }
  }
}
