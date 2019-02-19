import * as express from 'express';

import { DataRoutes } from './src/controllers/dataRoutes';
import { UserRoutes } from './src/Controllers/routes/userRoutes';
import { DashboardRoutes } from './src/Controllers/routes/dashboardRoutes';

const app: express.Application = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

//mount routes here
app.use('/api', DataRoutes);
app.use('/api/users', UserRoutes);
app.use('/api/dashboard',DashboardRoutes);

app.listen(port, () => {
    console.log(`listening at localhost:${port}`);
});