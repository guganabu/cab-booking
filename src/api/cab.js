import { Router } from 'express';
import CabModel from '../models/cab';
import RideModel from '../models/ride';
import CabService from '../services/cab';

const router = Router({
    mergeParams: true,
});

router.post('/request', async (req, res) => {
    const {start_latitude, start_longitude, color_preference } = req.body;
    const cabService = new CabService();
    const cabModel = new CabModel();
    const rideModel = new RideModel();
    try {
        const startPoint = {latitude: start_latitude, longitude: start_longitude};
        const nearestCab = await cabService.getNearestCab(startPoint, color_preference);
        if (nearestCab) {
            await cabModel.updateCabAvailability(nearestCab.cab_id);
            const rideId = await rideModel.createRide(nearestCab.cab_id, startPoint);
            res.status(200).send({
                ride_id: rideId,
                cab_id: nearestCab.cab_id,
                model: nearestCab.model,
                range: nearestCab.range,
                color: nearestCab.color
            })
        } else {
            res.status(404).send('Cab not available');
        }
    } catch(err) {
        // Rollback cab availability
        await cabModel.updateCabAvailability(nearestCab.cab_id, true);
        res.status(500).send(`Error: Could not fetch cabs`)
    }
});

export default router;
