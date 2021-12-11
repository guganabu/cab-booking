import express from 'express';
import api from './api';
import bodyParser from 'body-parser';
import logger from './utils/logger';
import {engine} from 'express-handlebars';
import path from 'path'
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/api', api);

app.engine('hbs', engine({
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.listen(port, () => {
    logger.info(`Server started & running at at http://localhost:${port}`);
});
