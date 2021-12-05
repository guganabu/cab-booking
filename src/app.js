import express from 'express';
import api from './api';
import bodyParser from 'body-parser';
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/api', api);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
