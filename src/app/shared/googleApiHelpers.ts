import * as fetch from 'node-fetch';
import { UrlBuilder } from "radweb";

export async function GetGeoInformation(address: string) {

    if (!address || address == '')
        return new GeocodeInformation();
    let u = new UrlBuilder('https://maps.googleapis.com/maps/api/geocode/json');
    u.addObject({
        key: process.env.GOOGLE_GECODE_API_KEY,
        address: address,
        language: 'HE'
    });
    return new GeocodeInformation(await (await fetch.default(u.url)).json() as GeocodeResult);


}
export class GeocodeInformation {
    constructor(public info: GeocodeResult = null) {
        if (!this.info)
            this.info = { results: [], status: 'none' };
    }
    public saveToString() {
        return JSON.stringify(this.info);
    }
    static fromString(s: string) {
        try {
            return new GeocodeInformation(JSON.parse(s));
        }
        catch (err) {
            return new GeocodeInformation();
        }
    }
    ok() {
        return this.info.status == "OK";
    }
    location(): Location {
        if (!this.ok())
            return undefined;
        return this.info.results[0].geometry.location;
    }
    getlonglat() {
        return this.location().lat + ',' + this.location().lng;
    }
    getCity() {
        let r = 'לא ידוע';
        if (this.ok())
            this.info.results[0].address_components.forEach(x => {
                if (x.types[0] == "locality")
                    r = x.long_name;
            });
        return r;
    }
    static GetDistanceBetweenPoints(x: Location, center: Location) {
        return Math.abs(((x.lat - center.lat) * (x.lat - center.lat)) + Math.abs((x.lng - center.lng) * (x.lng - center.lng))) * 10000000
    }
}

export interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
}

export interface Location {
    lat: number;
    lng: number;
}



export interface Viewport {
    northeast: Location;
    southwest: Location;
}

export interface Geometry {
    location: Location;
    location_type: string;
    viewport: Viewport;
}

export interface Result {
    address_components: AddressComponent[];
    formatted_address: string;
    geometry: Geometry;
    partial_match: boolean;
    place_id: string;
    types: string[];
}

export interface GeocodeResult {
    results: Result[];
    status: string;
}

