import CabModel from "../models/cab";
import { CAB_SERVICE_RANGE_IN_MILES } from "../constants";
import { haversineDistance, extractLatLongFromPoint, sortBy } from "../utils";
export default class CabService {

    /**
     * Method to fetch all cabs whicher available within given range and prefernce
     * @param {Object} startPoint
     * @param {String} colorPreference
     * @returns 
     */
    async getNearestCab(startPoint, colorPreference) {
        const cabModel = new CabModel();
        try {
          const cabs = await cabModel.getAvailableCabsByPref(colorPreference)
          const cabsInRange = await this.getCabsInRange(startPoint, cabs);
          return cabsInRange[0];
        } catch(err) {
            throw err;
        }
    };

    /**
     * Method to get all cabs which is available under given distance range from starting point
     * @param {OBject} startPoint 
     * @param {Array} cabs 
     * @returns 
     */
    async getCabsInRange(startPoint, cabs) {
        const cabsInRange = [];
        cabs.forEach(cab => {
            const {latitude, longitude} = cab;
            const cabRange = haversineDistance(startPoint, {latitude, longitude});
            if (cabRange <= CAB_SERVICE_RANGE_IN_MILES) {
                cabsInRange.push({...cab, range: cabRange});
            }
        })
        return await sortBy(cabsInRange, 'range');
    }
}
