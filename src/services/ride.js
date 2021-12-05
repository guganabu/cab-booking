import RideModel from "../models/ride"
export default class RideService {

    constructor() {
        this.rideModel = new RideModel();
    }

    /**
     * Method to create a ride for given cab & start point
     * @param {Integer} cabId 
     * @param {Object} startPoint 
     * @returns {Integer} rideId
     */
    async createRide(cabId, startPoint) {
        try {
            return await this.rideModel.createRide(cabId, startPoint);
        } catch (err) {
            console.error(err)
            throw err;
        }
    }
}
