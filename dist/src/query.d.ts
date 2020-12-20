import { QueryAttribute } from "./query-attribute";
/**
 * Base class for From and Where object. The query class
 * accepts your array data, and can return it via the 'select' function
 * Stand alone, this function is useful to alias attributes of
 * your array objects
 */
export declare class Query {
    private fromArray;
    constructor(from: Array<any>);
    /**
     * Fetch the Array of this query
     */
    protected getQueryArray(): Array<any>;
    /**
     * Returns an array containing only the desired attributes, aliased by the provided alias value
     * @param attributes The Select attributes and aliases
     * @returns Your final array
     */
    select(attributes?: string[] | QueryAttribute[] | null): Array<any>;
    private setAttribute;
}
