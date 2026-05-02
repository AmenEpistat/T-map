export const INITIAL_VIEW = {
    longitude: 49.1064,
    latitude: 55.7921,
    zoom: 14,
    pitch: 0,
    bearing: 0,
} as const;

export const MAP_STYLE = `https://api.maptiler.com/maps/019de233-3207-7134-8869-4ce2c08a9f27/style.json?key=${import.meta.env.VITE_MAPTILER_API_KEY}`;

export const ZOOM_ICON = 14;
export const ZOOM_TEXT = 16;

export const characterSet =
    'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя1234567890!@#$%^&*()_+-=[]{}|;\':",./<>? ';
