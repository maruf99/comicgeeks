import cheerio from 'cheerio';
import fetch from 'node-fetch';
import {
    BASE_URL,
    CollectionTypes,
    DEFAULT_AVATAR,
    FilterTypes,
    SortTypes
} from './constants';
import type {
    Comic,
    DateResolvable,
    FetchOptions,
    RequestParameters,
    User
} from './interfaces';
import Parsers, { ParserFunction } from './parsers';
import Sorts from './sorts';
import { formatURL, resolveDate, resolvePublishers } from './util';

async function _fetchData(params: Partial<RequestParameters>, parser: ParserFunction): Promise<Comic[]> {
    const url = formatURL(`${BASE_URL}/comic/get_comics`, params);
    const { list } = await fetch(url).then(res => res.json());

    const $ = cheerio.load(list);

    const data: Comic[] = $('li')
        .map(parser($))
        .get();

    return data;
}

async function _fetchComics(params: Partial<RequestParameters>, options: Partial<FetchOptions>, parser: ParserFunction = Parsers.Issue): Promise<Comic[]> {
    if (options?.publishers) {
        if (!Array.isArray(options.publishers)) throw new TypeError('The \'publishers\' option must be an array of publisher names or IDs.');
        params.publisher = resolvePublishers(options.publishers);
    }

    if (options?.filter) {
        if (!Array.isArray(options.filter)) throw new TypeError(`The 'filter' option must be an array of FilterTypes.`);

        const types = Object.values(FilterTypes);
        for (const type of options.filter) {
            if (!types.includes(type)) throw new RangeError(`The 'filter' option must only include FilterTypes. Received ${type}.`);
        }

        params.format = options.filter;
    }

    if (options?.sort && !Object.values(SortTypes).includes(options.sort)) {
        throw new RangeError(`The 'sort' option must be one of '${Object.values(SortTypes).join('\', \'')}'. Received '${options.sort}'.`);
    }

    const data = await _fetchData(params, parser);

    if (options?.sort) {
        switch (options.sort) {
            case SortTypes.MostPulled: {
                return data;
            }
            case SortTypes.PickOfTheWeek: {
                return data.sort(Sorts.PotW);
            }
            case SortTypes.AlphaAsc: {
                return data.sort(Sorts.Alpha);
            }
            case SortTypes.AlphaDesc: {
                return data.sort(Sorts.Alpha).reverse();
            }
            case SortTypes.LowPrice: {
                return data.sort(Sorts.Price).reverse();
            }
            case SortTypes.HighPrice: {
                return data.sort(Sorts.Price);
            }
            case SortTypes.CommunityConsensus: {
                return data.sort(Sorts.Community);
            }
        }
    }

    return data;
}

/**
 * Fetches comic releases for a specified week
 * @param id The ID for the publisher
 * @param date The release week, as a Date object or a string in ISO 8601 format
 * @param options The options for fetching the releases
 * @example Fetch the single issue releases for DC Comics with an A-Z sort
 * ```typescript
 * fetchReleases(new Date(), {
 *      publishers: ['DC Comics'],
 *      filter: [
 *          FilterTypes.Regular,
 *          FilterTypes.Digital,
 *          FilterTypes.Annual
 *      ],
 *      sort: SortTypes.AlphaAsc
 * })
 *    .then(console.log)
 *    .catch(console.error);
 * ```
 */
export function fetchReleases(date: DateResolvable, options?: Partial<FetchOptions>): Promise<Comic[]> {
    const params = {
        list: 'releases',
        list_option: 'thumbs',
        view: 'list',
        date: resolveDate(date),
        date_type: 'week'
    };

    return _fetchComics(params, options);
}

/**
 * Fetches a user's pull list for a specified week
 * @param userID The ID for the user
 * @param date The release week, as a Date object or a string in ISO 8601 format
 * @param options The options for fetching the pull list
 * @example
 * ```typescript
 * fetchPulls(122444, new Date(), {
 *  sort: SortTypes.AlphaAsc
 * })
 *    .then(console.log)
 *    .catch(console.error);
 * ```
 */
export function fetchPulls(userID: number, date: DateResolvable, options?: Partial<FetchOptions>): Promise<Comic[]> {
    const params = {
        list: 1,
        list_option: 'thumbs',
        view: 'list',
        user_id: userID,
        date: resolveDate(date),
        date_type: 'week'
    };

    return _fetchComics(params, options);
}

/**
 * Fetches a user's collection, in either series or issue format
 * @param userID The ID for the user
 * @param format The format to return the results in
 * @param options The options for fetching the collection
 * @example Fetch a collection in series format
 * ```typescript
 * fetchCollection(122444, CollectionTypes.Series, {
 *  sort: SortTypes.AlphaAsc
 * })
 *    .then(console.log)
 *    .catch(console.error);
 * ```
 */
export function fetchCollection(userID: number, format: CollectionTypes = CollectionTypes.Issue, options?: Partial<FetchOptions>): Promise<Comic[]> {
    const params = {
        list: 2,
        list_option: format,
        view: format === CollectionTypes.Issue ? 'list' : 'thumbs',
        user_id: userID
    };

    return _fetchComics(params, options, format === CollectionTypes.Issue ? Parsers.Issue : Parsers.Series);
}

/**
 * Fetches a user's wish list, in either series or issue format
 * @param userID The ID for the user
 * @param format The format to return the results in
 * @param options The options for fetching the wish list
 * @example Fetch a wish list in issue format
 * ```typescript
 * fetchWishList(122444, CollectionTypes.Issue, {
 *  sort: SortTypes.AlphaAsc
 * })
 *    .then(console.log)
 *    .catch(console.error);
 * ```
 */
export function fetchWishList(userID: number, format: CollectionTypes = CollectionTypes.Issue, options?: Partial<FetchOptions>): Promise<Comic[]> {
    const params = {
        list: 3,
        list_option: format,
        view: format === CollectionTypes.Issue ? 'list' : 'thumbs',
        user_id: userID
    };

    return _fetchComics(params, options, format === CollectionTypes.Issue ? Parsers.Issue : Parsers.Series);
}

/**
 * Fetches search results based on a query
 * @param query The query to search  for
 * @param format The format to return the results in
 * @example
 * ```typescript
 * fetchSearchResults('batman', CollectionTypes.Issue)
 *    .then(console.log)
 *    .catch(console.error);
 * ```
 */
export function fetchSearchResults(query: string, format: CollectionTypes = CollectionTypes.Issue): Promise<Comic[]> {
    const params = {
        list: 'search',
        title: query,
        list_option: format
    };

    return _fetchData(params, Parsers.Series);
}

/**
 * Fetches user details based on a user name, if they exist
 * @param name The name for the user to fetch details for
 * @example Fetch a user
 * ```typescript
 * fetchUser('maruf99')
 *    .then(console.log)
 *    .catch(console.error);
 * ```
 */
export async function fetchUser(name: string): Promise<User | null> {
    const url = `${BASE_URL}/profile/${name.toLowerCase()}/pull-list`;

    try {
        const text = await fetch(url).then(res => res.text());
        const $ = cheerio.load(text);

        const details = $('#comic-list-block').first();
        if (!details) return null;

        const avatar = $('.avatar-user.mr-3 a img').attr('src');

        return {
            id: Number(details.attr('data-user')),
            name: $('title').text().slice(0, -47),
            url,
            avatar: avatar ?? DEFAULT_AVATAR
        };
    } catch {
        return null;
    }
}