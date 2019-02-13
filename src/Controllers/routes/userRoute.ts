import { Router, Request, Response } from 'express';
import { UserManager } from '../userManager';

const router: Router = Router();

router.get('/:userId', (req: Request, res: Response) => {
    var userId = req.params.userId;
    if(!userId){
        res.json({
            "error": "invalid or empty userId"
        });
    }

    var userManager = new UserManager();
    userManager.getUserById(userId).then((user) => {
        res.json(user);
    });
    
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
    if(body.firstName && body.lastName && body.phone && body.email && body.userType){
        var userManager = new UserManager();
        userManager.addUser(body.email, body.firstName, body.lastName, body.phone, body.userType).then((result) => {
            res.json(result);
        });
    }
    else{
        res.json({"error": "invalid data"});
    }
});

router.delete('/deleteUser/:userId', (req: Request, res: Response) => {
    var userId = req.params.userId;
    if(!userId){
        res.json({
            "error": "invalid or empty userId"
        });
    }

    var userManager = new UserManager();
    var result = userManager.deleteUserById(userId).then((result) => {
        res.json(result);
    });
});

router.put('/updateUser', (req: Request, res: Response) => {
    var body = req.body;
    console.log("in updateUser");
    if(body.firstName && body.lastName && body.phone && body.newEmail && body.userType && body.oldEmail){
        var userManager = new UserManager();
        userManager.updateUser(body.oldEmail, body.newEmail, body.firstName, body.lastName, body.phone, body.userType).then((result) => {
            res.json(result);
        });
    }
    else{
        res.json({"error": "invalid data"});
    }
});

export const UserRoutes: Router = router;