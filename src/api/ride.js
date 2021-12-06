import { Router } from 'express';
import RideService from '../services/ride';
import logger from '../utils/logger';

const router = Router({
    mergeParams: true,
});

router.post('/start', async (req, res) => {
    const { ride_id, passenger } = req.body;
    logger.info('POST /rides/start ', ride_id);
    const rideService = new RideService();
    try {
        const startTime = await rideService.startRide(ride_id, passenger);
        res.status(200).send({ start_time: startTime });
    } catch (err) {
        logger.error(err);
        res.status(500).send(`Error: Could not start ride`);
    }
});

router.post('/complete', async (req, res) => {
    const { ride_id, latitude, longitude } = req.body;
    logger.info('POST /rides/complete ', ride_id);
    const rideService = new RideService();
    try {
        const rideFare = await rideService.completeRide(
            ride_id,
            latitude,
            longitude
        );
        res.status(200).send({ total_cost: rideFare });
    } catch (err) {
        logger.error(err);
        res.status(500).send(`Error: Could not complete ride`);
    }
});

export default router;
