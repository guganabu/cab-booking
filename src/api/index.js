import { Router } from 'express';
import ride from './ride';
import cab from './cab';
const router = Router();

console.log('ride', ride)
router.use('/rides', ride);
router.use('/cabs', cab);

export default router;
