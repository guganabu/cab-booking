import { Router } from 'express';

const router = Router({
    mergeParams: true,
});

router.get('/', (req, res) => {
    res.json({ status: 'done' });
});

export default router;
