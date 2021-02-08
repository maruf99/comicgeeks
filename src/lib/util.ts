import { Publishers } from './constants';
import type { DateResolvable, PublisherResolvable } from './interfaces';

export function formatURL(url: string, obj: Record<string, any>): string {
    const parts: string[] = [];

    for (const key of Object.keys(obj)) {
        const val = obj[key];
        if (Array.isArray(val)) {
            for (const v of val) parts.push(`${key}[]=${String(v)}`);
        } else {
            parts.push(`${key}=${String(val)}`);
        }
    }

    return `${url}?${parts.join('&')}`;
}

export function resolvePublishers(publishers: PublisherResolvable[]): number[] {
    return publishers.map(p => {
        if (typeof p === 'number') return p;
        if (typeof p === 'string' && Reflect.has(Publishers, p)) return Publishers[p];
        throw new TypeError(`'${p}' is not a valid publisher name or ID.`);
    });
}

export function resolveDate(date: DateResolvable): string {
    if (date instanceof Date) return date.toISOString().split('T')[0];
    if (typeof date !== 'string' || !validDate(date)) throw new TypeError('The \'date\' parameter must be a Date object or string ISO 8601 format.');
    return date;
}

function validDate(date: string): boolean {
    const [year, month, day] = date.split('-');
    if (year?.length === 4 && month?.length === 2 && day?.length === 2) return true;
    return false;
}