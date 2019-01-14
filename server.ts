import * as express from 'express';

import { TestRoutes } from './src/controllers/testRoute';

const app: express.Application = express();
const port = process.env.PORT || 3000;

//mount routes here
app.use('/', TestRoutes);

app.listen(port, () => {
    console.log(`listening at localhost:${port}`);
});