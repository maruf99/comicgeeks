import { BASE_URL } from './constants';
import type { Comic } from './interfaces';

type Parser = 'Issue' | 'Series';
export type ParserFunction = ($: cheerio.Root) => (_: number, el: cheerio.Element) => Comic;

export default {
    Issue: $ => (_, el) => {
        const element = $(el);

        const cover = element.find('.comic-cover-art img').attr('data-src').replace('medium', 'large');
        const [publisher] = element.find('.comic-details').text().split('·');
        const description = element.find('.comic-description.col-feed-max');
        const url = `${BASE_URL}${description.find('a').attr('href')}`;

        const pulls = element.attr('data-pulls');
        const potw = element.attr('data-potw');
        const rating = element.attr('data-community');

        description.find('a').remove();

        return {
            name: element.find('.title.color-primary').text().trim(),
            publisher: publisher?.trim(),
            url,
            cover: cover === '/assets/images/no-cover-med.jpg' ? `${BASE_URL}${cover.replace('-med', '-lg')}` : cover,
            description: description.text().trim(),
            price: element.find('.price').text().trim(),
            rating: rating?.length ? Number(rating) : null,
            pulls: pulls?.length ? Number(pulls) : null,
            potw: potw?.length ? Number(potw) : null
        };
    },

    Series: $ => (_, el) => {
        const element = $(el);
        return {
            name: element.find('.title.color-primary').text().trim(),
            publisher: element.find('.publisher.color-offset').text().trim(),
            url: `${BASE_URL}${element.find('.cover a').attr('href')}`,
            cover: element.find('.cover img').attr('data-src')!.replace('medium', 'large')
        };
    }
} as Record<Parser, ParserFunction>;