import RideModel from '../models/ride';
import CabModel from '../models/cab';
import {
    getCurrentTime,
    haversineDistance,
    getTimeDiffInMin,
    round,
} from '../utils';
import { CAB_FARE, FARE_CURRENCY, CAB_HIPSTER_COLORS } from '../constants';
import logger from '../utils/logger';
export default class RideService {
    constructor() {
        this.rideModel = new RideModel();
        this.cabModel = new CabModel();
    }

    /**
     * Method to create a ride for given cab & start point
     * @param {Number} cabId
     * @param {Object} startPoint
     * @returns {Number} rideId
     */
    async createRide(cabId, startPoint) {
        try {
            const rideId = await this.rideModel.createRide(cabId, startPoint);
            logger.info(`RideService: Ride created for ${rideId}`);
            return rideId;
        } catch (err) {
            logger.error(`Failed creating ride ${err}`);
            return Promise.reject(err);
        }
    }

    /**
     * Method to start ride for given rideId and return ride started time
     * @param {Number} rideId
     * @param {String} passenger
     * @returns {String}
     */
    async startRide(rideId, passenger) {
        try {
            const startTime = getCurrentTime();
            await this.rideModel.startRide(rideId, passenger, startTime);
            logger.info(`RideService: ride started for ${rideId}`);
            return startTime;
        } catch (err) {
            logger.error('Failed starting ride', err);
            return Promise.reject(err);
        }
    }

    /**
     * Method to complete ride and return total fare amount
     * @param {Number} rideId
     * @param {Float} latitude
     * @param {Float} longitude
     * @returns {String}
     */
    async completeRide(rideId, latitude, longitude) {
        try {
            const endTime = getCurrentTime();
            const rideData = await this.rideModel.getRide(rideId);
            const rideFare = this.calculateFare(rideData);
            await this.rideModel.completeRide(
                rideId,
                latitude,
                longitude,
                endTime,
                rideFare
            );
            await this.cabModel.updateCabPoint(
                rideData.cab_id,
                { latitude, longitude },
                true
            );
            logger.info(`RideService: ride completed for ${rideId}`);
            return rideFare;
        } catch (err) {
            logger.error(`Failed complete ride ${err}`);
            return Promise.reject(err);
        }
    }

    /**
     * Method to calculate ride fare based on duration & distance
     * Additional cost applied based on the cab preference ex, PINK color
     * @param {Object} ride
     * @returns {String}
     */
    calculateFare(ride) {
        const startPoint = {
            latitude: ride.start_latitude,
            longitude: ride.start_longitude,
        };
        const endPoint = {
            latitude: ride.end_latitude,
            longitude: ride.end_longitude,
        };
        const rideDistance = haversineDistance(startPoint, endPoint);
        const rideDurationInMin = getTimeDiffInMin(
            ride.start_time,
            ride.end_time
        );
        const isPassengerPreferredHipsterColor = CAB_HIPSTER_COLORS.some(
            (hipsterColor) => ride.color == hipsterColor
        );
        let rideFare =
            rideDistance * CAB_FARE.PER_KM +
            rideDurationInMin * CAB_FARE.PER_MIN;
        rideFare +=
            (isPassengerPreferredHipsterColor && CAB_FARE.COLOR_PREFERENCE) ||
            0;
        logger.info('RideService: fare calculated for', ride.id);
        return `${round(rideFare)} ${FARE_CURRENCY}`;
    }
}
