import { Router } from 'express';
import RideService from '../services/ride';
import logger from '../utils/logger';

const router = Router({
    mergeParams: true,
});

router.patch('/start/:id', async (req, res) => {
    const { id } = req.params;
    const { passenger } = req.body;
    logger.info(`PATCH /rides/start/${id}`);
    const rideService = new RideService();
    try {
        const startTime = await rideService.startRide(id, passenger);
        res.status(200).send({ start_time: startTime });
    } catch (err) {
        logger.error(err);
        res.status(500).send(`Error: Could not start ride`);
    }
});

router.post('/complete', async (req, res) => {
    const { ride_id, latitude, longitude } = req.body;
    logger.info(`POST /rides/complete ${ride_id}`);
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
