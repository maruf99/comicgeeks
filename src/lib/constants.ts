import Publishers from './publishers.json';
export { Publishers };

/** @hidden */
export const BASE_URL = 'https://leagueofcomicgeeks.com';

/** @hidden */
export const DEFAULT_AVATAR = `${BASE_URL}/assets/images/profile-photo-default-large.jpg`;

/**
 * The types that collections of comics can be fetched with
 *
 * - Issue - Return each item as a separate issue
 *
 * - Series - Return the individual series for each item
 */
export enum CollectionTypes {
    Issue = 'issue',
    Series = 'series'
}

/**
 * The types that comic lists can be filtered with
 *
 * - Regular - Regular issues
 *
 * - Variant - Variant issues or reprints
 *
 * - Trade - Trade paperbacks
 *
 * - Hardcover - Hardcovers
 *
 * - Digital - Digital issues
 *
 * - Annual - Annuals
 */
export enum FilterTypes {
    Regular = 1,
    Variant,
    Trade,
    Hardcover,
    Digital,
    Annual
}

/**
 * The types that comic lists can be sorted by
 *
 * - MostPulled - Most Pulled
 *
 * - PickOfTheWeek - Pick of the Week
 *
 * - AlphaAsc - Alphabetical (A-Z)
 *
 * - AlphaDesc - Alphabetical (Z-A)
 *
 * - LowPrice - Price (Low to High)
 *
 * - HighPrice - Price (High to Low)
 *
 * - CommunityConsensus - Community Consensus
 */
export enum SortTypes {
    MostPulled = 'pulls',
    PickOfTheWeek = 'potw',
    AlphaAsc = 'alpha-asc',
    AlphaDesc = 'alpha-desc',
    LowPrice = 'price-asc',
    HighPrice = 'price-desc',
    CommunityConsensus = 'community'
}