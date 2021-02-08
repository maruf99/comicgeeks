export declare const BASE_URL = "https://leagueofcomicgeeks.com";
export declare const SINGLE_REGEXP_CASE_SENSITIVE: RegExp;
export declare const SINGLE_REGEXP_CASE_INSENSITIVE: RegExp;
export declare const TRADE_REGEXP: RegExp;
export declare const TRADE_FILTER_REGEXP: RegExp;
/**
 * The types that pull lists can be filtered with
 *
 * - `Single` - Filter pull lists to only include singles
 *
 * - `Trade` - Filter pull lists to only include trades
 */
export declare const enum FilterTypes {
    Single = "singles",
    Trade = "trades"
}
