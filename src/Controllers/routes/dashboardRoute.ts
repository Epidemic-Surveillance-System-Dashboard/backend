import { Router, Request, Response } from 'express';
import { DashboardManager } from '../dashboardManager';

const router: Router = Router();

router.get('/:userId', (req: Request, res: Response) => {
    var userId = req.params.userId;
    if(!userId){
        res.json({
            "error": "invalid or empty userId"
        });
    }

    var dashboardManager = new DashboardManager();
    dashboardManager.getDashboardConfig(userId).then((dashboard) => {
        res.json(dashboard);
    });
});

router.post('/addDashboard', (req: Request, res: Response) => {
    var body = req.body;

    if(body.Email && body.UserId, body.DashboardJson){
        var dashboardManager = new DashboardManager();
        dashboardManager.addDashboardConfig(body.Email, body.UserId, body.DashboardJson).then((result) => {
            res.json(result);
        });
    }
    else{
        res.status(400);
        res.json({"error": "invalid data"});
    }
});

router.put('/updateUser', (req: Request, res: Response) => {
    var body = req.body;

    if(body.UserId, body.DashboardJson){
        var dashboardManager = new DashboardManager();
        dashboardManager.updateDashboardConfig(body.UserId, body.DashboardJson)
        .then((result) => {
            res.json(result);
        });
    }
    else{
        res.json({"error": "invalid data"});
    }
});

export const DashboardRoutes: Router = router;