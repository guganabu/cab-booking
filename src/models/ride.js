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
            const sql = `INSERT INTO ride 
            (cab_id, start_latitude, start_longitude) 
            VALUES (?, ?, ?)`;
            const rowId = await this.runQuery(sql, [
                cabId,
                startPoint.latitude,
                startPoint.longitude,
            ]);
            logger.info(`RideModel: ride created with id ${rowId}`);
            return rowId;
        } catch (err) {
            logger.error(`RideModel: failed creating ride ${err}`);
            return Promise.reject(new Error(`Failed creating ride`));
        }
    }

    /**
     * Method to get ride details
     * @param {Number} rideId
     * @returns {Object}
     */
    async getRide(rideId) {
        try {
            const sql = `SELECT r.*,c.* FROM ride as r 
                INNER JOIN cab c ON (c.id = r.cab_id)
                WHERE r.id = ? AND r.cab_id = r.cab_id`;
            const rideData =await this.getQuery(sql, [rideId]);
            logger.info(`RideModel: Fetched ride details for id ${rideId}`);
            return rideData;
        } catch (err) {
            logger.error(`RideModel: failed fetching ride ${rideId} ${err}`);
            return Promise.reject(new Error('Failed to get ride'));
        }
    }

    /**
     * Mehtod to start a ride
     * @param {Number} rideId
     * @param {String} passenger
     * @param {Datetime} startTime
     * @returns
     */
    async startRide(rideId, passenger, startTime) {
        try {
            const sql = `UPDATE ride SET
            passenger = ?, start_time = ? 
            WHERE id = ?`;
            await this.runQuery(sql, [passenger, startTime, rideId]);
            logger.info(`RideModel: started ride for id ${rideId}`);
            return;
        } catch (err) {
            logger.error(`RideModel: failed start ride for id ${rideId} ${err}`);
            return Promise.reject(new Error('Failed to start ride'));
        }
    }

    /**
     * Method to complete a ride
     * @param {Number} rideId
     * @param {Float} latitude
     * @param {Float} longitude
     * @param {Datetime} endTime
     * @param {String} cost
     * @returns
     */
    async completeRide(rideId, latitude, longitude, endTime, cost) {
        try {
            const sql = `UPDATE ride SET
            end_latitude = ?, end_longitude = ?, end_time = ?, cost = ? 
            WHERE id = ?`;
            await this.runQuery(sql, [
                latitude,
                longitude,
                endTime,
                cost,
                rideId,
            ]);
            logger.info(`RideModel: Ride completed for id ${rideId}`);
            return;
        } catch (err) {
            logger.error(`RideModel: Failed copleting ride for id ${rideId} ${err}`);
            return Promise.reject(new Error('Failed to complete ride'));
        }
    }
}
