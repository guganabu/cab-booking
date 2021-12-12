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
        `POST: /cabs/request at point: ${start_latitude},${start_longitude}`
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
            logger.info(`Cab request processed, ride id ${cabRide.rideId}`);
            res.status(200).type('application/json').send({
                ride_id: cabRide.rideId,
                cab_id: cabRide.cab_id,
                model: cabRide.model,
                range: cabRide.range,
                color: cabRide.color,
            });
        } else {
            logger.warn('Cab request denied, cab not available');
            res.status(404)
                .type('application/json')
                .send({ message: 'Cab not available in range' });
        }
    } catch (err) {
        logger.error(err);
        res.status(500).type('application/json').send({ message: err });
    }
});

router.get('/list', async (_, res) => {
    logger.info(
        `GET: /cabs/list`
    );
    const cabService = new CabService();
    try {
        const cabs = await cabService.getAvailableCabs();
        if (cabs.length) {
            res.render('cabs', {cabs});
        } else {
            logger.warn('Cabs are not available')
            res.status(404).type('application/json').send({message: 'Cabs not available'})
        }
    } catch (err) {
        logger.error(err);
        res.status(500).type('application/json').send({ message: err });
    }
    
})

export default router;
