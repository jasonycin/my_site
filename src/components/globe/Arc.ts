type Coordinate = { lat: number, lng: number, alt?: number};

export type GlobeArc = {
    startLat: Coordinate["lat"],
    startLng: Coordinate["lng"],
    endLat: Coordinate["lat"],
    endLng: Coordinate["lng"],
    color: string[] | string
}

const DUDELDORF = {lat: 49.9738, lng: 6.6362};
const WILLIAMSBURG = {lat: 37.2692, lng: -76.7074};

export const DUDELDORF_WILLIAMSBURG_ARC: GlobeArc = {
    startLat: DUDELDORF.lat,
    startLng: DUDELDORF.lng,
    endLat: WILLIAMSBURG.lat,
    endLng: WILLIAMSBURG.lng,
    color: ["#b9bed1", "#54a561"]
};