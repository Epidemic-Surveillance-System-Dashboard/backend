import { Router, Request, Response } from 'express';
import { UserManager } from '../userManager';

const router: Router = Router();

router.get('/:userId', (req: Request, res: Response) => {
    console.log("###############UserID###########");
    var userId = req.params.userId;
    if(!userId){
        res.json({"error": "invalid or empty userId"});
    }

    var userManager = new UserManager();
    userManager.getUserById(userId).then((user) => {
        res.json(user);
    });
});

router.get('/temp/allUsers', (req: Request, res: Response) => {
    console.log("###############Helloworld###########");
    var userManager = new UserManager();
    userManager.obtainAllUsers().then((user) => {
        res.json(user);
    });
});

router.get('/getAllUsers/:userId', async (req: Request, res: Response) => {
    console.log("###############here1###########");
    var userId = req.params.userId;
    if(!userId){
        res.json({
            "error": "invalid or empty userId"
        });
    }

    var userManager = new UserManager();
    userManager.getAllUsers(userId).then((users) => {
        res.json(users);
    });
});

router.post('/addUser', (req: Request, res: Response) => {
    var body = req.body;

    if(body.FirstName && body.LastName && body.Phone && body.Email && 
        body.UserType && body.LocationId && body.LocationType){
        var userManager = new UserManager();
        userManager.addUser(body.Email, body.FirstName, body.LastName, body.Phone, body.UserType, 
            body.LocationId, body.LocationType).then((result) => {
            res.json(result);
        });
    }
    else{
        res.status(400);
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
    if(body.FirstName && body.LastName && body.Phone && body.Email && body.UserType && body.Id && body.LocationId && body.LocationType){
        var userManager = new UserManager();
        userManager.updateUser(body.Id, body.Email, body.FirstName, body.LastName, body.Phone, body.UserType, body.LocationId, body.LocationType)
        .then((result) => {
            res.json(result);
        });
    }
    else{
        res.json({"error": "invalid data"});
    }
});

export const UserRoutes: Router = router;