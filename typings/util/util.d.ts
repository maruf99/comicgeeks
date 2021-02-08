import { Comic, ComicFilter } from '../lib/interfaces';
import { FilterTypes } from '../util/constants';
/**
 * Filters the items in a pull list based on a specified criteria
 * @param pulls The pull list to filter
 * @param filter The filter to run each item against. Can be one of the two builtins (`singles`, `trades`) or a custom function
 */
export declare function filterPulls(pulls: Comic[], filter?: FilterTypes | ComicFilter): Comic[];
/**
 * Sorts a pull list alphabetically
 * @param pulls The pull list to sort
 */
export declare function sortPulls(pulls: Comic[]): Comic[];
