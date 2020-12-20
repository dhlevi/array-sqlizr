import { QueryAttribute } from "./query-attribute";
import { Query } from './query';
/**
 * The Where class extends Query functions. Used as the "final" stage
 * of a SQLizr query, it can sort, limit, and inject unioned data. Additional
 * where clauses cannot be added
 * @extends Query
 */
export declare class Where extends Query {
    orderBy(compareFn?: (a: any, b: any) => number, reverse?: boolean): Where;
    /**
     * Order the array in Ascending order
     * @param attribute the attribute to order by
    */
    orderByAsc(attribute: QueryAttribute | string): Where;
    /**
     * Order the array in Descending order
     * @param attribute the attribute to order by
    */
    orderByDesc(attribute: QueryAttribute | string): Where;
    /**
     * Limits the number of returned results by this amount. This will
     * immediately reduce the result count, so it's recommended to
     * do any sorting before limiting
     * @param limit
     */
    limit(limit: number): Where;
    /**
     * "Union" Two datasets together. This is just a wrapper around
     * Array.concat
     * @param unionedData The array you wish to concatenate into the current data
     */
    union(unionedData: Array<any>): Where;
    /**
     * Count of items in the array. Just a wrapper around Array.length
     */
    count(): number;
    /**
     * Calculate the sum of an attribute in your array
     * @param attribute The attribute to sum
     */
    sum(attribute: QueryAttribute | string): number;
    /**
     * Calculate the average value of an attribute in your array
     * @param attribute the attribute to average
     */
    average(attribute: QueryAttribute | string): number;
}
