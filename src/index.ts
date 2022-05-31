import config from '../config.json';
import { CreateImageDelivery } from './deliverySystem';
import axios from 'axios';

const imageDelivery = new CreateImageDelivery();
imageDelivery.subscribe(async (embed, image, query, url) => {
    console.log(`URL: ${url} ID: ${image.id} QUERY DUMP: "${query}"`);
    for (const webhook of config.WEBHOOKS) {
        await axios.post(webhook, embed);
    }
});
