import * as express from 'express';

class TestRoute {

    public expressInstance;
    public router;

    constructor() {
        this.expressInstance = express();
        this.router = express.Router();

        this.router.route('/test').get((req, res) => {
            res.json({msg: "hello world"});
        });
    }
}