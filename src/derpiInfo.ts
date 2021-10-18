import { Fetch, ResultSortFormat, Image }  from 'node-derpi'
import { sample }  from 'lodash'

const cache = new Set();
const cacheClearSize = 1000;
const maxRecursion = 10;
const recursionWait = 1000;

export async function getRandomImage(query: string, filterID: number, loop = 0): Promise<undefined | Image> {
    const results = await Fetch.search({
        query, sortFormat: ResultSortFormat.RANDOM,
        filterID
    });
    if (results.images.length === 0) {
        return undefined;
    }

    const mapped  = results.images.filter(e => !cache.has(e.id));
    if (mapped.length === 0) {
        if (loop > maxRecursion) {
            return undefined;
        }

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                getRandomImage(query, filterID, ++loop).then(resolve).catch(reject);
            }, recursionWait);
        });
    } 

    if (cache.size > cacheClearSize) {
        cache.clear();
    }

    const randomImage = sample(mapped);
    if (randomImage) {
        cache.add(randomImage.id);
        return randomImage;
    }
}
