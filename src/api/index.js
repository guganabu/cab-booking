import { Router } from 'express';
import ride from './ride';
import cab from './cab';
const router = Router();

router.use('/rides', ride);
router.use('/cabs', cab);

export default router;
