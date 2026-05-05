const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';

const KAZAN_VIEWBOX = '48.95,55.92,49.45,55.65';
const RESULTS_LIMIT = 5;

export interface AddressSuggestion {
    id: string;
    address: string;
    lat: number;
    lng: number;
}

interface NominatimRawAddress {
    road?: string;
    house_number?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
}

interface NominatimRawResult {
    place_id: number;
    lat: string;
    lon: string;
    address?: NominatimRawAddress;
}

const buildSearchUrl = (query: string): string => {
    const params = new URLSearchParams({
        q: query,
        format: 'json',
        addressdetails: '1',
        limit: String(RESULTS_LIMIT),
        'accept-language': 'ru',
        countrycodes: 'ru',
        bounded: '1',
        viewbox: KAZAN_VIEWBOX,
    });
    return `${NOMINATIM_BASE_URL}?${params.toString()}`;
};

const normalizeAddress = (
    raw: NominatimRawAddress | undefined
): string | null => {
    if (!raw?.road || !raw?.house_number) {
        return null;
    }

    const city = raw.city ?? raw.town ?? raw.village ?? raw.municipality;
    if (!city) {
        return null;
    }

    return `${raw.road}, ${raw.house_number}, ${city}`;
};

const mapRawToSuggestion = (
    raw: NominatimRawResult
): AddressSuggestion | null => {
    const address = normalizeAddress(raw.address);
    if (!address) {
        return null;
    }

    const lat = Number(raw.lat);
    const lng = Number(raw.lon);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
        return null;
    }

    return {
        id: String(raw.place_id),
        address,
        lat,
        lng,
    };
};

export const searchAddresses = async (
    query: string
): Promise<AddressSuggestion[]> => {
    const url = buildSearchUrl(query);
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `Не удалось получить подсказки адресов (статус ${response.status})`
        );
    }

    const raw: NominatimRawResult[] = await response.json();
    const suggestions = raw
        .map(mapRawToSuggestion)
        .filter(
            (suggestion): suggestion is AddressSuggestion => suggestion !== null
        );

    const seen = new Set<string>();
    return suggestions.filter((s) => {
        if (seen.has(s.address)) {
            return false;
        }
        seen.add(s.address);
        return true;
    });
};
