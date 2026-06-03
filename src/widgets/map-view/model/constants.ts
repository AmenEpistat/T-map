export const INITIAL_VIEW = {
    longitude: 49.1064,
    latitude: 55.7921,
    zoom: 14,
    pitch: 0,
    bearing: 0,
} as const;

export const MAP_STYLE = `https://api.maptiler.com/maps/019e7a44-1028-739e-8595-842fc1def1a7/style.json?key=${import.meta.env.VITE_MAPTILER_API_KEY}`;

export const ZOOM_ICON = 14;
export const ZOOM_TEXT = 16;

export const characterSet =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя1234567890!@#$%^&*()_+-=[]{}|;\':",./<>? ';
