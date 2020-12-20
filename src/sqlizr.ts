import { From } from "./from"

/**
 * Root class for SQLizr. Doesn't really do much except allow you to start
 * a "From". This class should eventually have the ability to parse a SQL
 * string as well!
 */
export class SQLizr {
  public static from (array: Array<any>): From {
    return new From(array)
  }
}
