export interface PlusCode {
  compound_code: string;
  global_code: string;
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

export interface Northeast {
  lat: number;
  lng: number;
}

export interface Southwest {
  lat: number;
  lng: number;
}

export interface Viewport {
  northeast: Northeast;
  southwest: Southwest;
}

export interface Northeast2 {
  lat: number;
  lng: number;
}

export interface Southwest2 {
  lat: number;
  lng: number;
}

export interface Bounds {
  northeast: Northeast2;
  southwest: Southwest2;
}

export interface Geometry {
  location: Location;
  location_type: string;
  viewport: Viewport;
  bounds: Bounds;
}

export interface PlusCode2 {
  compound_code: string;
  global_code: string;
}

export interface Result {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
  plus_code: PlusCode2;
  types: string[];
  postcode_localities: string[];
}

export interface ResponseGoogleMaps {
  plus_code: PlusCode;
  results: Result[];
  status: string;
}

export interface Distance {
  text: string;
  value: number;
}

export interface Duration {
  text: string;
  value: number;
}

export interface Element {
  distance: Distance;
  duration: Duration;
  status: string;
}

export interface Row {
  elements: Element[];
}

export interface ResponseMatrixGoogleMaps {
  destination_addresses: string[];
  origin_addresses: string[];
  rows: Row[];
  status: string;
}

export interface Coordinates {
  timestamp: number;
  coords: { latitude?: number; longitude?: number };
  articlesCoords: { latitude?: number; longitude?: number }[];
}
