import config from '../config.json';
import { CreateImageDelivery } from './deliverySystem';
import axios from 'axios';

const imageDelivery = new CreateImageDelivery(config.SCHEDULE, config.QUERY, config.FILTER_ID);
imageDelivery.subscribe(async (embed, image, query) => {
    console.log(`ID${image.id} QUERY DUMP: "${query}"`);
    for (const webhook of config.WEBHOOKS) {
        await axios.post(webhook, embed);
    }
});