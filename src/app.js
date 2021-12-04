import express from 'express';
import api from './api';
const app = express();
import bodyParser from 'body-parser';
const port = 3000;

// parse application/json
app.use(bodyParser.json());

app.use('/api', api);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
