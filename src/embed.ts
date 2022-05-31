import { Image, WebHookData } from './interfaces';
const getImageIdUrl = (baseUrl: string, id: string | number) => `${baseUrl}images/${id}`;

export function embedImage(url: string, icon: string, image: Image): WebHookData {
    const USERNAME_LIMIT = 80;
    let username = "Unknown artist";
    // data.username = "Unknown artist";
    const artistSearch = "artist:";
    const artists = image.tags.filter(t => t.startsWith(artistSearch)).map(t => t.slice(artistSearch.length));
    if (artists.length) {
        // brute force string len 
        while (artists.length) {
            const artistUsername = artists.join(", ");
            if (artistUsername.length >= USERNAME_LIMIT) {
                artists.pop();
            } else {
                username = artists.join(", ");
                break;
            }
        }
    } 

    const content = [
        `Post: <${getImageIdUrl(url, image.id)}>`,
        `Full: ${image.representations.full}`,
    ].join("\n");
  
    return { 
        username,
        avatar_url: icon,
        content,
    };
}
