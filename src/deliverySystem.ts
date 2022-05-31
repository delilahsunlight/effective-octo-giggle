import { getRandomImage } from "./derpiInfo";
import { embedImage } from "./embed";
import * as ontime from 'ontime';
import { Image, QueryService, WebHookData,  } from "./interfaces";
import { sample } from "lodash";
import { CONFIG } from "./config";

type SubscribeFunction = (embed: WebHookData, image: Image, query: string, url: string) => void;
export class CreateImageDelivery { 
    private fns: SubscribeFunction [] = [];
    private services: QueryService[] = [];

    constructor() {
        for (const service of CONFIG.SERVICES) {
            for (let i = 0; i < service.SEND_RATE; i++) {
                this.services.push(service);
            }
        }
        this.services.sort(() => Math.random() < 0.5 ? 1 : -1);


        (ontime as any).default({
            cycle: CONFIG.SCHEDULE
        }, async (ot: any) => {
            await this.doTask();
            ot.done();
            return;
        })
        console.info(`Loaded ${CONFIG.SERVICES.length}`);
        console.log(this.services);
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

    private async doTask() {
        const service = sample(this.services)!;
        const { FILTER_ID: filerId, QUERY: query}= sample(service!.QUERIES)!;

        const image = await getRandomImage(service.URL, query, filerId);
        if (image) {
            const embed = embedImage(service.URL, service.ICON, image);
            for (const fn of this.fns) {
               fn(embed, image, query, service.URL);
            }
        } else {
            console.error(`Image was not found under query tags "${query}"`);
        }
    }
}
