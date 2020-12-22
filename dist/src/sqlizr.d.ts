import { From } from "./from";
/**
 * Root class for SQLizr. Doesn't really do much except allow you to start
 * a "From". This class should eventually have the ability to parse a SQL
 * string as well!
 */
export declare class SQLizr {
    static from(array: Array<any>): From;
    /**
     * Parse a query string. Provide the query string (in SQL style), the "From" array, and an (in order)
     * list of join arrays
     * @example SELECT name, boss.name AS bossName, (wages.wage * 40) AS weeklyIncome FROM employees JOIN wages ON job = title WHERE active === true LIMIT 10 ORDER BY wage ASC
     * @param query The query string to parse
     * @param from The From array
     * @param joins The arrays to join (order in query assumed)
     * @param unions The arrays to union (order in query assumed)
     */
    static parse(query: string, from: Array<any>, joins?: Array<Array<any>>, unions?: Array<Array<any>>): Array<any>;
}
