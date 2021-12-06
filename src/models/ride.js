import DbModel from './index';
import logger from '../utils/logger';
export default class RideModel extends DbModel {
    /**
     * Method to create a ride for given cab and start location
     * @param {Number} cabId
     * @param {Object} startPoint
     * @returns {Number}
     */
    async createRide(cabId, startPoint) {
        try {
            logger.info('RideModel: Add ride row');
            const sql = `INSERT INTO ride 
            (cab_id, start_latitude, start_longitude) 
            VALUES (?, ?, ?)`;
            return await this.runQuery(sql, [
                cabId,
                startPoint.latitude,
                startPoint.longitude,
            ]);
        } catch (err) {
            logger.error(err);
            throw new Error('Failed to create ride');
        }
    }

    /**
     * Method to get ride details
     * @param {Number} rideId
     * @returns {Object}
     */
    async getRide(rideId) {
        try {
            logger.info('RideModel: Get ride details');
            const sql = `SELECT r.*,c.* FROM ride as r 
                INNER JOIN cab c ON (c.id = r.cab_id)
                WHERE r.id = ? AND r.cab_id = r.cab_id`;
            return await this.getQuery(sql, [rideId]);
        } catch (err) {
            logger.error(err);
            throw new Error('Failed to get ride');
        }
    }

    /**
     * Mehtod to start a ride
     * @param {Number} rideId
     * @param {String} passenger
     * @param {Datetime} startTime
     * @returns {Number}
     */
    async startRide(rideId, passenger, startTime) {
        try {
            logger.info('RideModel: start ride');
            const sql = `UPDATE ride SET
            passenger = ?, start_time = ? 
            WHERE id = ?`;
            return await this.runQuery(sql, [passenger, startTime, rideId]);
        } catch (err) {
            logger.error(err);
            throw new Error('Failed to create ride');
        }
    }

    /**
     * Method to complete a ride
     * @param {Number} rideId
     * @param {Float} latitude
     * @param {Float} longitude
     * @param {Datetime} endTime
     * @param {String} cost
     * @returns {Number}
     */
    async completeRide(rideId, latitude, longitude, endTime, cost) {
        try {
            logger.info(`RideModel: completeRide model ${rideId}`);
            const sql = `UPDATE ride SET
            end_latitude = ?, end_longitude = ?, end_time = ?, cost = ? 
            WHERE id = ?`;
            return await this.runQuery(sql, [
                latitude,
                longitude,
                endTime,
                cost,
                rideId,
            ]);
        } catch (err) {
            logger.error(err);
            throw new Error('Failed to complete ride');
        }
    }
}
