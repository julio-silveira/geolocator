import node_geocoder from "node-geocoder";

class GeoLib {
  constructor(
    private readonly geocoder: node_geocoder.Geocoder
  ) {}

  public async getAddressFromCoordinates(coordinates: [number, number] | { lat: number; lng: number }): Promise<string> {
    const address = await this.geocoder.reverse({ lat: coordinates[1], lon: coordinates[0] });

    if (!address.length) {
      throw new Error('Address not found');
    }

    return address[0].formattedAddress;
  };

  public async getCoordinatesFromAddress(address: string): Promise<{ lat: number; lng: number }> {
    const coordinates = await this.geocoder.geocode(address);
    if (!coordinates.length) {
      throw new Error('Address not found');
    }

    const firstCoordinates = coordinates[0];

    return  {
      lat: firstCoordinates?.latitude,
      lng: firstCoordinates?.longitude
    }
  };
}

const geocoder = node_geocoder({
  "provider": "openstreetmap"
});

export default new GeoLib(geocoder);
