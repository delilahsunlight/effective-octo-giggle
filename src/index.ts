import config from '../config.json';
import { Client, TextChannel } from 'discord.js';
import { CreateImageDelivery } from './deliverySystem';
import { sample } from 'lodash';

const client = new Client();

class FatalError extends Error {
    constructor(message: string) {
        super(message);
        console.error(this);
        client.destroy();
        process.exit(1);
    }
}

function validateChannel(channel: TextChannel) {
    if (!channel.nsfw) {
        throw new FatalError(`Channel need to have NSFW flag enabled!`);
    }
    if (!(channel.guild.me && channel.permissionsFor(channel.guild.me)?.has('EMBED_LINKS'))) {
        throw new FatalError(`Missing embed permission "EMBED_LINKS"`);
    }
}

client.on('ready', async () => {
    try {
        const channel = await client.channels.fetch(config.CHANNEL_ID) as TextChannel;
        if (!channel) {
            throw new FatalError(`Channel "${config.CHANNEL_ID}" does not exist!`);
        }
        if (channel.type !== 'text') {
            throw new FatalError(`Expected channel type "GUILD_TEXT" got "${channel.type}".`);
        }
        validateChannel(channel);
        console.info(`Ready and bound to channel "${channel.name}"`)
        const imageDelivery = new CreateImageDelivery(config.SCHEDULE, config.QUERY, config.FILTER_ID);
        imageDelivery.subscribe(async (embed, image, query) => {
            console.log(`ID${image.id} QUERY DUMP: "${query}"`);
            validateChannel(channel);
            try {
                if (image.representations.webm) {
                    embed.image = null;
                    await channel.send(embed);
                    channel.send(image.representations.webm);
                    
                } else {
                    await channel.send(embed);
                }

            } catch (error) {
                console.error(error);
            }
        })
    } catch (error) {
        throw new FatalError(error as any);
    }
});
client.login(config.TOKEN);