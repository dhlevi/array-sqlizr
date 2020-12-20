/**
 * A class defining an attribute for a Query. Generally used
 * to alias an attribute from the source array data, but can also
 * be used to define an expression
 */
export class QueryAttribute {
  public attributeName: string
  public alias: string
  public expression: string | null

  constructor (attributeName: string, alias: string, expression: string | null = null) {
    this.attributeName = attributeName
    this.alias = alias
    this.expression = expression
  }
}