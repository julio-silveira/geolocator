import { expect } from 'chai'
import sinon from 'sinon'
import { BadRequestError } from '../errors/BadRequestError'
import { GeoLib } from './lib'

describe('GeoLib', () => {
    let geocoderMock
    let geoLib: GeoLib

    beforeEach(() => {
        geocoderMock = {
            reverse: sinon.stub(),
            geocode: sinon.stub(),
        }

        geoLib = new GeoLib(geocoderMock)
    })

    describe('getAddressFromCoordinates', () => {
        it('should return address from coordinates', async () => {
            const mockCoordinates = { lat: 40.7128, lng: -74.006 }

            geocoderMock.reverse.resolves([
                { formattedAddress: 'New York, NY, USA' }
            ])

            const address = await geoLib.getAddressFromCoordinates(mockCoordinates)

            expect(address).to.equal('New York, NY, USA')
            expect(geocoderMock.reverse.calledWith({ lat: 40.7128, lon: -74.006 })).to.be.true
        })

        it('should throw BadRequestError if no address found', async () => {
            const mockCoordinates = { lat: 40.7128, lng: -74.006 }

            geocoderMock.reverse.resolves([])

            try {
                await geoLib.getAddressFromCoordinates(mockCoordinates)
            } catch (error) {
                expect(error).to.be.an.instanceOf(BadRequestError)
                expect(error.message).to.equal('Unable to get address from sent coordinates')
            }
        })

        it('should throw BadRequestError if geocoder fails', async () => {
            const mockCoordinates = { lat: 40.7128, lng: -74.006 }

            geocoderMock.reverse.rejects(new Error('Geocoder error'))

            try {
                await geoLib.getAddressFromCoordinates(mockCoordinates)
            } catch (error) {
                expect(error).to.be.an.instanceOf(BadRequestError)
                expect(error.message).to.equal('Unable to get address from sent coordinates')
            }
        })
    })

    describe('getCoordinatesFromAddress', () => {
        it('should return coordinates from address', async () => {
            const mockAddress = 'New York, NY, USA'

            geocoderMock.geocode.resolves([
                { latitude: 40.7128, longitude: -74.006 }
            ])

            const coordinates = await geoLib.getCoordinatesFromAddress(mockAddress)

            expect(coordinates).to.deep.equal({ lat: 40.7128, lng: -74.006 })
            expect(geocoderMock.geocode.calledWith(mockAddress)).to.be.true
        })

        it('should throw BadRequestError if address not found', async () => {
            const mockAddress = 'Non-existent address'

            geocoderMock.geocode.resolves([])

            try {
                await geoLib.getCoordinatesFromAddress(mockAddress)
            } catch (error) {
                expect(error).to.be.an.instanceOf(BadRequestError)
                expect(error.message).to.equal('Address not found')
            }
        })
    })
})
