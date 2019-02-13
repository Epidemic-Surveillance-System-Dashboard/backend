import { Router, Request, Response } from 'express';
import { UserManager } from './userManager';

const router: Router = Router();

router.get('/:userId', (req: Request, res: Response) => {
    var userId = req.params.userId;
    if(!userId){
        res.json({
            "error": "invalid or empty userId"
        });
    }

    var userManager = new UserManager();
    var user = userManager.getUserById(userId);
    res.json({user});
});

router.get('/getAllUsers/:userId', async (req: Request, res: Response) => {
    var userId = req.params.userId;
    if(!userId){
        res.json({
            "error": "invalid or empty userId"
        });
    }

    var userManager = new UserManager();
    userManager.getAllUsers(userId).then((users) => {
        res.json({users});
    });
});

router.post('/addUser', (req: Request, res: Response) => {
    var body = req.body;
    console.log("recieved addUser POST request");
    console.log(body);
    res.json(body);
});

export const UserRoutes: Router = router;