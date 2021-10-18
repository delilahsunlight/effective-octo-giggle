import { MessageEmbed } from 'discord.js';
import { Image } from 'node-derpi';
import * as Jimp from 'jimp';
const colorThief = require('color-thief-jimp');

export async function embedImage(image: Image) {
    const embed = new MessageEmbed();
    embed.setTitle(`https://derpibooru.org/images/${image.id}`);
    embed.setImage(image.representations.full);

    if (image.artistNames) {
        embed.setDescription(`Artist: ${image.artistNames.join(', ')}`);
    }
    embed.setFooter(`${image.height}x${image.width} - ${image.originalFormat}`);
    embed.setTimestamp(image.updated);
    try {
        await setEmbedColour(embed, image.representations.thumbnailSmall);
    } catch (error) {
        embed.setColor('WHITE');
        
    }
    return embed;
 }

 
 async function setEmbedColour(embed: MessageEmbed, image: any) {
    try {
        const colour = await stealColor(image);
        embed.setColor(colour);
    } catch (error) {
        //console.error(error);
        embed.setColor('WHITE');
    }
}

async function stealColor(image: any): Promise<number> {
    const jimp = Jimp.read(image);
    return parseInt(colorThief.getColorHex(jimp), 16);
}