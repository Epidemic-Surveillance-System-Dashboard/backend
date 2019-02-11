import {Router, Request, Response} from 'express';

const router: Router = Router();

router.get('/:userId', (req: Request, res: Response) => {
    //state, lga, ward, facility

    var h = req.params.userId;
    res.json({h});
});

export const UserRoutes: Router = router;