export type MapCategory = 'food' | 'entertainment' | 'shopping';
export type MapLayer = 'anomalies';

export type ViewState = {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch: number;
    bearing: number;
};

export type ClusterDataType = {
    h3Index: string;
    txCount: number;
    avgCheck: number;
    isAnomaly: boolean;
    anomalyRatio: number;
};

export type ClusterDetail = ClusterDataType & {
    districtName: string;
    districtImageUrl: string;
    category: MapCategory;
    sumAmount: number;
    baselineAvg: number;
};

export type Bounds = {
    swLat: number;
    swLng: number;
    neLat: number;
    neLng: number;
};
