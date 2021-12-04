import { Router } from 'express';
import ride from './ride';
import cab from './cab';
const router = Router();

router.use('/ride', ride);
router.use('/cab', cab);

export default router;
