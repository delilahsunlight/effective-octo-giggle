import { getRandomImage } from "./derpiInfo";
import { embedImage } from "./embed";
import * as ontime from 'ontime';
import { Image, WebHookData } from "./interfaces";
import { sample } from "lodash";

type SubscribeFunction = (embed: WebHookData, image: Image, query: string) => void;
export class CreateImageDelivery { 
    private fns: SubscribeFunction [] = [];

    constructor(schedule: string[], private queries: string[], private filterID: number) {
         (ontime as any).default({
            cycle: schedule
        }, async (ot: any) => {
            await this.doTask();
            ot.done();
            return;
        })
    }

    subscribe(fn: SubscribeFunction) {
        if (this.fns.indexOf(fn) === -1) {
            this.fns.push(fn);
        }
    }
    unsubscribe(fn: SubscribeFunction) {
        const index = this.fns.indexOf(fn);
        if (index !== -1) {
            this.fns.splice(index, 1);
        }
    }
    setQuery(queries: string[]) {
        this.queries = queries;
    }

    private async doTask() {
        const query = sample(this.queries)!;
        const image = await getRandomImage(query, this.filterID);
        if (image) {
            const embed = embedImage(image);
            for (const fn of this.fns) {
               fn(embed, image, query);
            }
        } else {
            console.error(`Image was not found under query tags "${query}"`);
        }
    }
}
