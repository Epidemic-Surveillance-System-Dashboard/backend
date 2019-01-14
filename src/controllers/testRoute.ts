import {Router, Request, Response} from 'express';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
    res.json({msg: "hello world"});
});

router.get('/testing', (req: Request, res: Response) => {
    res.json({msg: "hello world test"});
});

export const TestRoutes: Router = router;