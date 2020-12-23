import { From } from "./from"
import { QueryAttribute } from "./query-attribute"

/**
 * Root class for SQLizr. Doesn't really do much except allow you to start
 * a "From". This class should eventually have the ability to parse a SQL
 * string as well!
 */
export class SQLizr {
  public static from (array: Array<any>): From {
    return new From(array)
  }

  /**
   * Parse a query string. Provide the query string (in SQL style), the "From" array, and an (in order)
   * list of join arrays
   * @example SELECT name, boss.name AS bossName, (wages.wage * 40) AS weeklyIncome FROM employees JOIN wages ON job = title WHERE active === true LIMIT 10 ORDER BY wage ASC
   * @param query The query string to parse
   * @param from The From array
   * @param joins The arrays to join (order in query assumed)
   * @param unions The arrays to union (order in query assumed)
   */
  public static parse (query: string, from: Array<any>, joins: Array<Array<any>> = [], unions: Array<Array<any>> = []): Array<any> {
    const reversedJoins = [...joins].reverse()
    const reversedUnions = [...unions].reverse()

    const idxQuery = query.replace(/from/ig, '&@*FROM')
                          .replace(/outer join/ig, '&@*OUTJN')
                          .replace(/inner join/ig, '&@*INJN')
                          .replace(/join/ig, '&@*JOIN')
                          .replace(/where/ig, '&@*WHERE')
                          .replace(/order by/ig, '&@*ORDRBY')
                          .replace(/limit/ig, '&@*LIMIT')
                          .replace(/union/ig, '&@*UNION')
                          .trim()
    const parts = idxQuery.split('&@*')
    
    // From... should be obvious, and we can ignore it
    let queryFrom = new From(from)

    let whereClause = ''

    // Joins
    for (const part of parts) {
      if (part.toUpperCase().startsWith('JOIN') || part.toUpperCase().startsWith('OUTJN') || part.toUpperCase().startsWith('INJN')) {
        const joinArray = reversedJoins.pop()
        if (joinArray) {
          // gnarly, but it works... 
          const identifier = part.split(new RegExp('ON', 'i'))[0].substring(4).trim()
          const fromAttribute = part.split(new RegExp('ON', 'i'))[1].split('=')[0].trim()
          const joinAttribute = part.split(new RegExp('ON', 'i'))[1].split('=')[1].trim()
          queryFrom = queryFrom.join(joinArray, identifier, fromAttribute, joinAttribute, part.toUpperCase().startsWith('INJN'))
        }
      } else if (part.toUpperCase().startsWith('WHERE')) {
        whereClause = part.split(new RegExp('WHERE', 'i'))[1].trim()
      }
    }

    let where = queryFrom.where(whereClause)

    // Any extra Where bits
    for (const part of parts) {
      if (part.toUpperCase().startsWith('LIMIT')) {
        const limit = part.split(new RegExp('LIMIT', 'i'))[1].trim()
        where = where.limit(parseInt(limit))
      } else if (part.toUpperCase().startsWith('ORDRBY')) {
        const attribute = part.split(' ')[2]
        if (part.toUpperCase().includes('ASC')) {
          where = where.orderByAsc(attribute)
        } else {
          where = where.orderByDesc(attribute)
        }
      } else if (part.toUpperCase().startsWith('UNION')) {
        const union = reversedUnions.pop()
        if (union) {
          where = where.union(union)
        }
      }
    }

    // parse the SELECT
    const select: Array<any> = []
    for (const part of parts) {
      if (part.toUpperCase().startsWith('SELECT') && part.toUpperCase().trim() !== 'SELECT *') {
        // SELECT name AS petName, owner.name AS ownerName
        const trimmedPart = part.trim().substring(6).trim()
        const clauses = trimmedPart.split(',')
        for (const clause of clauses) {
          const attributeAliases = clause.split(new RegExp('as', 'i'))
          
          const attribute = attributeAliases[0].trim()
          const alias = attributeAliases.length > 1 ? attributeAliases[1].trim() : attribute

          if (attribute.startsWith('(') && attribute.endsWith(')')) {
            // expression parse
            select.push(new QueryAttribute('expression', alias, attribute.substring(1, attribute.length - 1)))
          } else {
            select.push(new QueryAttribute(attribute, alias))
          }
        }

        break
      }
    }

    // return the resulting array
    return where.select(select)
  }
}
