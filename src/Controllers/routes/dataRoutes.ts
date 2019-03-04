import {Router, Request, Response} from 'express';
import { DataByLocationAccess } from '../../ApplicationDataAccess/dataByLocationAccess';
import { HierarchyAccess } from '../../ApplicationDataAccess/hierarchyAccess';
import * as config from 'config';

const router: Router = Router();

router.get('/locationsHierarchy', (req: Request, res: Response) => {    
    var sqlConfig = config.get('sqlConfig');
    var hierarchyAccess = new HierarchyAccess(sqlConfig); 
    
    var data = hierarchyAccess.getAllLocationsHierarchy().then(result=>{
        if (result != null) {
            
            var jsonObj = {
                State: result.recordsets[0],
                LGA: result.recordsets[1],
                Ward: result.recordsets[2],
                Facility: result.recordsets[3]
            }
            res.json(jsonObj);
        } else {
            res.status(400);
            res.send("Bad Request");
        }
    });     
});

router.get('/data/location', (req: Request, res: Response) => {
    var state = req.query.state;
    var lga = req.query.lga;
    var ward = req.query.ward;
    var facility = req.query.facility;
    var sqlConfig = config.get('sqlConfig');
    var dataByLocationAccess = new DataByLocationAccess(sqlConfig); 
    
    var data = dataByLocationAccess.getDataByLocation(state, lga, ward, facility).then(result=>{
        if (result != null) {
            var jsonObj = {
                Data: result.recordsets[0],
                Sets: result.recordsets[1],
                Groups: result.recordsets[2],
                Metrics: result.recordsets[3]
            };
            res.json(jsonObj);
        } else {
            res.status(400);
            res.send("Bad Request");
        }
    });    
});

router.get('/data/hierarchy', (req: Request, res: Response) => {
    var sqlConfig = config.get('sqlConfig');
    var hierarchyAccess = new HierarchyAccess(sqlConfig); 
    
    var data = hierarchyAccess.getAllDataHierarchy().then(result=>{
        if (result != null) {
            
            var jsonObj = {
                Groups: result.recordsets[0],
                Sets: result.recordsets[1],
                Metrics: result.recordsets[2]
            }
            res.json(jsonObj);
        } else {
            res.status(400);
            res.send("Bad Request");
        }
    }); 
});

export const DataRoutes: Router = router;