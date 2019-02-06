import * as express from 'express';

import { DataRoutes } from './src/controllers/dataRoutes';

const app: express.Application = express();
const port = process.env.PORT || 3000;

//mount routes here
app.use('/api', DataRoutes);

app.listen(port, () => {
    console.log(`listening at localhost:${port}`);
});