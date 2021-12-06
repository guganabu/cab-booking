import DbModel from './index';
import logger from '../utils/logger';
export default class CabModel extends DbModel {
    /**
     * Method to fetch all available cabs by matching given preference
     * Usually preference object has color key
     * @param {Object} preference
     * @returns {Array}
     */
    async getAvailableCabsByPref(colorPreference) {
        const sql = `SELECT c.*, cp.* FROM cab AS c INNER JOIN cab_point AS cp 
            ON c.id = cp.cab_id WHERE cp.is_available = true AND c.color = ?`;
        try {
            const rows = await this.queryAll(sql, [colorPreference]);
            logger.info('CabModel: all available cabs fetched', rows.length);
            return rows;
        } catch (err) {
            logger.error('CabModel Failed fetching cabs', err);
            throw new Error('Failed fetching cabs');
        }
    }

    /**
     * Method to update cab point availability
     * @param {Integer} cabId
     * @param {Boolean} status
     * @returns
     */
    async updateCabPoint(cabId, point = undefined, availability = false) {
        const sql = `UPDATE cab_point SET 
        is_available = ${availability} ${
            point
                ? ', latitude =' +
                  point.latitude +
                  ', longitude =' +
                  point.longitude
                : ''
        }
        WHERE cab_id = ${cabId}`;
        try {
            await this.runQuery(sql, []);
            logger.info('CabModel: Updated cab point for ', cabId);
            return;
        } catch (err) {
            logger.error('CabModel Failed updating cab availability', err);
            throw new Error('Failed updating cab availability');
        }
    }
}
