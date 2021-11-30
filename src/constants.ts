export const BASE_URL = "https://derpibooru.org/"; 
export const SEARCH_API = `${BASE_URL}api/v1/json/search/images`; 
export const FAV_ICON = `https://derpicdn.net/img/2018/10/5/1848628/thumb.jpg`; 
export const getImageIdUrl = (id: string | number) => `${BASE_URL}/images/${id}`;