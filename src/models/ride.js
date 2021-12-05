import {runQuery} from './index';
export default class RideModel {
    /**
     * Method to create a ride for given cab and start location
     * @param {Integer} cabId 
     * @param {Object} startPoint 
     * @returns {Integer}
     */
   async createRide(cabId, startPoint) {
        try {
            const sql = `INSERT INTO ride 
            (cab_id, start_latitude, start_longitude) 
            VALUES (?, ?, ?)`;
            return await runQuery(sql, [cabId, startPoint.latitude, startPoint.longitude])
        } catch(err) {
            console.error(err)
            throw new Error('Failed to create ride')
        }
        
    }
}
