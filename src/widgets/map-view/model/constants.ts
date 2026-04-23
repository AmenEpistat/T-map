export const INITIAL_VIEW = {
    longitude: 49.1064,
    latitude: 55.7921,
    zoom: 14,
    pitch: 45,
    bearing: 0,
} as const;

export const MAP_STYLE = `https://api.maptiler.com/maps/streets-v4/style.json?key=${import.meta.env.VITE_MAPTILER_API_KEY}`;
