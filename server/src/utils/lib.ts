import node_geocoder from 'node-geocoder'
import { BadRequestError } from '../errors/BadRequestError'

export class GeoLib {
    constructor(private readonly geocoder: node_geocoder.Geocoder) {}

    public async getAddressFromCoordinates(
        coordinates: [number, number] | { lat: number; lng: number }
    ): Promise<string> {
        const isArray = Array.isArray(coordinates)
        const lat = isArray ? coordinates[1] : coordinates.lat
        const lon = isArray ? coordinates[0] : coordinates.lng
        try {
            const address = await this.geocoder.reverse({ lat, lon })
            if (!address.length) {
                throw new BadRequestError(
                    'Unable to get address from sent coordinates'
                )
            }
            return address[0].formattedAddress
        } catch (error) {
            throw new BadRequestError(
                'Unable to get address from sent coordinates'
            )
        }
    }

    public async getCoordinatesFromAddress(
        address: string
    ): Promise<{ lat: number; lng: number }> {
        const coordinates = await this.geocoder.geocode(address)
        if (!coordinates.length) {
            throw new BadRequestError('Address not found')
        }

        const firstCoordinates = coordinates[0]
        return {
            lat: firstCoordinates?.latitude,
            lng: firstCoordinates?.longitude,
        }
    }
}

const geocoder = node_geocoder({
    provider: 'openstreetmap',
})

export default new GeoLib(geocoder)
