declare namespace google.maps.places {
  interface Autocomplete {
    addListener(eventName: string, handler: () => void): void;
    getPlace(): google.maps.places.PlaceResult;
  }

  interface AutocompleteOptions {
    componentRestrictions?: {
      country: string | string[];
    };
    fields?: string[];
    types?: string[];
  }

  interface PlaceResult {
    address_components?: google.maps.GeocoderAddressComponent[];
    formatted_address?: string;
    geometry?: {
      location?: google.maps.LatLng;
    };
  }

  class Autocomplete {
    constructor(
      inputField: HTMLInputElement,
      opts?: google.maps.places.AutocompleteOptions
    );
  }
}

declare namespace google.maps {
  interface GeocoderAddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
  }

  class LatLng {
    constructor(lat: number, lng: number);
    lat(): number;
    lng(): number;
  }

  namespace event {
    function clearInstanceListeners(instance: any): void;
  }
} 