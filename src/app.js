import express from 'express';
import api from './api';
import bodyParser from 'body-parser';
import logger from './utils/logger';
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/api', api);

app.listen(port, () => {
    logger.info(`Server started & running at at http://localhost:${port}`);
});
