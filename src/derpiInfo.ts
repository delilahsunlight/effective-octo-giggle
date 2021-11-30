import { sample }  from 'lodash'
import axios from 'axios';
import { QueryResult, Image } from './interfaces';
import { SEARCH_API } from './constants';
import { existsSync, readFileSync, writeFile } from 'fs';

interface Queries {
    [key: string]: string | number;
}

const cache = new Set<number>();
const cacheClearSize = 1000;
const maxRecursion = 10;
const recursionWait = 1000;

export async function getRandomImage(query: string, filterID: number, loop = 0): Promise<Image | undefined> {
    const queries: Queries = {};
    queries.q = query;
    queries.filter_id = filterID;
    queries.sf = "random";
    
    const qurifiedUrl = appendQuery(SEARCH_API, queries)

    const result = await axios.get<QueryResult>(qurifiedUrl);
    const images = result.data.images;
    
    if (images.length === 0) {
        return undefined;
    }

    const mapped  = images.filter(e => !cache.has(e.id));
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
        serialize();
    }

    const randomImage = sample(mapped);
    if (randomImage) {
        cache.add(randomImage.id);
        serialize();
        return randomImage;
    }
}

function appendQuery(url: string, queries: Queries) {
    let queryBuilder: string[] = []
    for (const [key, value] of Object.entries(queries)) {
        queryBuilder.push(`${key}=${encodeURI(value.toString())}`);
    }
    return `${url}?${queryBuilder.join("&")}`;
}

const file = "./cache.json";

function serialize() {
    const data: number[] = [];
    cache.forEach((value) => {
        data.push(value);
    });
    writeFile(file, JSON.stringify(data), err => {
        if (err) {
            console.error(err);
        }
    })
}

if (existsSync(file)) {
    const content = readFileSync(file, "utf-8");
    const data: number[]= JSON.parse(content);
    for (const key of data) {
        cache.add(key);
    }
}