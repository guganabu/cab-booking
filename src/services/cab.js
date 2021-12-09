import CabModel from '../models/cab';
import RideModel from '../models/ride';
import { CAB_SERVICE_RANGE_IN_KM } from '../constants';
import { haversineDistance, sortBy } from '../utils';
import logger from '../utils/logger';
export default class CabService {
    constructor() {
        this.cabModel = new CabModel();
        this.rideModel = new RideModel();
    }

    /**
     * Method to request a cab ride and returns cab details with ride id
     * @param {Object} startPoint
     * @param {String} colorPreference
     * @returns {Object}
     */
    async requestCabRide(startPoint, colorPreference) {
        try {
            const nearestCab = await this.getNearestCab(
                startPoint,
                colorPreference
            );
            try {
                if (nearestCab) {
                    await this.updateCabPoint(nearestCab.cab_id);
                    const rideId = await this.rideModel.createRide(
                        nearestCab.cab_id,
                        startPoint
                    );
                    logger.info(
                        `CabService: Nearest cab assigned for ride ${rideId}`
                    );
                    return { ...nearestCab, rideId };
                }
                logger.info(`CabService: Nearest cab is not available`);
                return null;
            } catch (err) {
                // Rollback cab point
                await this.updateCabPoint(nearestCab.cab_id, undefined, true);
                logger.error(`Cab request failed ${err}`);
                return Promise.reject(err);
            }
        } catch (err) {
            logger.error(`Failed fetching nearest cab ${err}`);
            return Promise.reject(err);
        }
    }

    /**
     * Method to fetch all cabs whicher available within given range and prefernce
     * @param {Object} startPoint
     * @param {String} colorPreference
     * @returns
     */
    async getNearestCab(startPoint, colorPreference) {
        try {
            const cabs = await this.cabModel.getAvailableCabsByPref(
                colorPreference
            );
            const cabsInRange = await this.getCabsInRange(startPoint, cabs);
            logger.info(
                `CabService: Total cabs found ${
                    cabsInRange.length
                } for point ${JSON.stringify(startPoint)}`
            );
            return cabsInRange[0];
        } catch (err) {
            logger.error(`Error while fetching nearest cab ${err}`);
            return Promise.reject(err);
        }
    }

    /**
     * Method to get all cabs which is available under given distance range from starting point
     * @param {Object} startPoint
     * @param {Array} cabs
     * @returns
     */
    async getCabsInRange(startPoint, cabs) {
        const cabsInRange = [];
        cabs.forEach((cab) => {
            const { latitude, longitude } = cab;
            const cabRange = haversineDistance(startPoint, {
                latitude,
                longitude,
            });
            if (cabRange <= CAB_SERVICE_RANGE_IN_KM) {
                cabsInRange.push({ ...cab, range: cabRange });
            }
        });
        return sortBy(cabsInRange, 'range');
    }

    /**
     * Method to update cab point & availability
     * @param {Number} cabId
     * @param {Object | undefined} point
     * @param {Boolean} availability
     * @returns
     */
    async updateCabPoint(cabId, point = undefined, availability = false) {
        try {
            await this.cabModel.updateCabPoint(cabId, point, availability);
            logger.info(`CabService: Updated cab point for cabID : ${cabId}`);
            return;
        } catch (err) {
            logger.error(`Could not update cab point ${err}`);
            return Promise.reject(err);
        }
    }
}
