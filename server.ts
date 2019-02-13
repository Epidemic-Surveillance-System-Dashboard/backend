import * as express from 'express';

import { DataRoutes } from './src/controllers/dataRoutes';
import { UserRoutes } from './src/controllers/userRoute';

const app: express.Application = express();
const port = process.env.PORT || 3000;

app.use(express.json());

//mount routes here
app.use('/api', DataRoutes);
app.use('/api/users', UserRoutes);

app.listen(port, () => {
    console.log(`listening at localhost:${port}`);
});