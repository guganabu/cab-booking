import DbModel from './index';
import logger from '../utils/logger';
export default class CabModel extends DbModel {
    /**
     * Method to fetch all available cabs by matching given preference
     * Usually preference object has color key
     * @param {Object} preference
     * @returns {Array}
     */
    async getAvailableCabs(colorPreference) {
        try {
            let sql = `SELECT c.*, cp.* FROM cab AS c INNER JOIN cab_point AS cp 
            ON c.id = cp.cab_id WHERE cp.is_available = true`;
            const conditions = [];
            if (colorPreference && colorPreference != '') {
                conditions.push('c.color = ?');
            }
            sql = conditions.length
                ? sql + ' AND ' + conditions.join('')
                : sql;
            const rows = await this.queryAll(sql, [colorPreference]);
            logger.info(`CabModel: Total cabs found ${rows.length}`);
            return rows;
        } catch (err) {
            logger.error(`CabModel: Failed fetching cabs ${err}`);
            return Promise.reject(new Error('Failed fetching cabs'));
        }
    }

    /**
     * Method to update cab point availability
     * @param {Integer} cabId
     * @param {Object | undefined} point
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
            logger.info(`CabModel: Updated cab point for cabId: ${cabId}`);
            return;
        } catch (err) {
            logger.error(`CabModel: Failed updating cab availability ${err}`);
            return Promise.reject(
                new Error('Failed updating cab availability')
            );
        }
    }
}
