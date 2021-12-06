import { Router } from 'express';
import CabService from '../services/cab';
import logger from '..//utils/logger';

const router = Router({
    mergeParams: true,
});

router.post('/request', async (req, res) => {
    const { start_latitude, start_longitude, color_preference } = req.body;
    const cabService = new CabService();
    logger.info(
        `GET: /cabs/request at point: ${start_latitude},${start_longitude}`
    );

    try {
        const startPoint = {
            latitude: start_latitude,
            longitude: start_longitude,
        };
        const cabRide = await cabService.requestCabRide(
            startPoint,
            color_preference
        );
        if (cabRide) {
            logger.info('Cab request processed, ride id', cabRide.rideId);
            res.status(200).send({
                ride_id: cabRide.rideId,
                cab_id: cabRide.cab_id,
                model: cabRide.model,
                range: cabRide.range,
                color: cabRide.color,
            });
        } else {
            res.status(404).send('Cab not available');
            logger.error('Cab request denied, cab not available');
        }
    } catch (err) {
        // Rollback cab availability
        res.status(500).send(`Error: Could not fetch cabs`);
        logger.error(`Cab request failed {${err}}`);
    }
});

export default router;
