import { ComicData, Filter, LocgUser } from './interfaces';
/**
 * Fetches the releases for a specified week and publisher ID
 * @param id The ID for the publisher
 * @param date The release week, in ISO 8601 format
 * @param filter The filter to run each item against
 */
export declare function fetchReleases(id: number, date: string, filter?: Filter): Promise<ComicData[]>;
/**
 * Fetches a pull list for a specified week and user ID
 * @param id The ID for the user
 * @param date The release week, in ISO 8601 format
 * @param filter The filter to run each item against
 */
export declare function fetchPulls(id: number, date: string, filter?: Filter): Promise<ComicData[]>;
/**
 * Fetches search results based on a query
 * @param query The query to search  for
 * @param filter The filter to run each item against
 */
export declare function fetchSearchResults(query: string, filter?: Filter): Promise<ComicData[]>;
/**
 * Fetches user details based on a user name, if they exist
 * @param name The name for the user to fetch details for
 */
export declare function fetchUser(name: string): Promise<LocgUser | null>;
