import { sample }  from 'lodash'
import axios from 'axios';
import { QueryResult, Image } from './interfaces';
import { existsSync, readFileSync, writeFile } from 'fs';
import { url } from 'inspector';


export const searchApi = (baseUrl: string) => `${baseUrl}api/v1/json/search/images`; 


interface Queries {
    [key: string]: string | number;
}

const cache = new Set<string>();
const cacheClearSize = 1000;
const maxRecursion = 10;
const recursionWait = 1000;

export async function getRandomImage(apiUrl: string, query: string, filterID: number, loop = 0): Promise<Image | undefined> {
    const queries: Queries = {};
    queries.q = query;
    queries.filter_id = filterID;
    queries.sf = "random";
    
    const qurifiedUrl = appendQuery(searchApi(apiUrl), queries)

    const result = await axios.get<QueryResult>(qurifiedUrl);
    const images = result.data.images;
    
    if (images.length === 0) {
        return undefined;
    }

    const origin = (new URL(apiUrl)).origin
    const getKey = (e: Image) => `${origin}${e.id.toString()}`
    const mapped  = images.filter(e => !cache.has(getKey(e)));
    if (mapped.length === 0) {
        if (loop > maxRecursion) {
            return undefined;
        }

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                getRandomImage(apiUrl, query, filterID, ++loop).then(resolve).catch(reject);
            }, recursionWait);
        });
    } 

    if (cache.size > cacheClearSize) {
        cache.clear();
        serialize();
    }

    const randomImage = sample(mapped);
    if (randomImage) {
        cache.add(getKey(randomImage));
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
    const data: string[] = [];
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
    const data: string[]= JSON.parse(content);
    for (const key of data) {
        cache.add(key);
    }
}