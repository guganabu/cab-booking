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
        res.status(200)
            .type('application/json')
            .send({ start_time: startTime });
    } catch (err) {
        logger.error(err);
        res.status(500).type('application/json').send({ message: err });
    }
});

router.patch('/complete/:id', async (req, res) => {
    const { id } = req.params;
    const { latitude, longitude } = req.body;
    logger.info(`PATCH /rides/complete ${id}`);
    const rideService = new RideService();
    try {
        const rideFare = await rideService.completeRide(
            id,
            latitude,
            longitude
        );
        res.status(200).type('application/json').send({ total_cost: rideFare });
    } catch (err) {
        logger.error(err);
        res.status(500).type('application/json').send({ message: err });
    }
});

export default router;
