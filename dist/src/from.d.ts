import { Query } from './query';
import { Where } from './where';
/**
 * The From class extends Query functionality with the ability to
 * Join arrays together. Additionally, after joins are completed
 * you can execute a "Where" expression, which will convert the
 * from dataset into a Where dataset.
 * @extends Query
 */
export declare class From extends Query {
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
    join(join: Array<any>, identifier: string, fromAttributeName: string, joinAttributeName: string, innerJoin?: boolean): From;
    /**
     * Uses the expression-eval library to evaluate an epxression. This does
     * not at any point execute an eval() statement, however you should be
     * cautious with any expression evaluation.
     * Your expression must result in a boolean, ie: 'attribute === 42'
     * You can pass in null to return all results without evaluating
     * @param expression An expression
     */
    where(expression?: string | null): Where;
    /**
     * A wrapper around the default Array.filter function. An
     * alternative to using the where expression evaluate function
     * @param predicate Your filter function
     */
    whereFilter(predicate: (value: any, index: number, array: any[]) => unknown): Where;
}
