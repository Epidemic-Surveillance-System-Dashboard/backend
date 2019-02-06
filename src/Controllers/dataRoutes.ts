import {Router, Request, Response} from 'express';

const router: Router = Router();

router.get('/locationsHierarchy', (req: Request, res: Response) => {
    //state, lga, ward, facility
    var state = req.query.state;
    var lga = req.query.lga;
    var ward = req.query.ward;
    var facility = req.query.facility;

    
    res.json({msg: "Recieved"});
});

router.get('/data/location', (req: Request, res: Response) => {
    //state, lga, ward, facility
    var state = req.query.state;
    var lga = req.query.lga;
    var ward = req.query.ward;
    var facility = req.query.facility;

    res.json({msg: "data location test"});
});

router.get('/data/hierarchy', (req: Request, res: Response) => {
    res.json({msg: "data hierarchy test"});
});

export const DataRoutes: Router = router;