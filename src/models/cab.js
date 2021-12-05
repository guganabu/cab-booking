import {queryAll, runQuery} from './index';
export default class CabModel {
    /**
     * Method to fetch all available cabs by matching given preference
     * Usually preference object has color key
     * @param {Object} preference 
     * @returns {Array}
     */
    async getAvailableCabsByPref(colorPreference) {
        const sql = `SELECT c.*, cp.* FROM cab AS c INNER JOIN cab_point AS cp 
            ON c.id = cp.cab_id WHERE cp.is_available = true AND c.color = ?`
        try {
            return await queryAll(sql, [colorPreference]);
        } catch(err) {
            console.error(err)
            throw new Error('Failed fetching cabs');
        }
    }

    /**
     * Method to update cab point availability
     * @param {Integer} cabId 
     * @param {Boolean} status 
     * @returns 
     */
    async updateCabAvailability(cabId, status = false) {
        const sql = `UPDATE cab_point SET is_available = ? WHERE cab_id = ?`
        try {
            return await runQuery(sql, [status, cabId]);
        } catch(err) {
            console.error(err)
            throw new Error('Failed updating cab availability');
        }
    }
}
