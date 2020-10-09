require('./config/config');
require('./db/mongoose');

const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes/index');

const app = express();

const port = process.env.PORT;

// app.use(express.json()); 

// app.use(express.urlencoded({ extended: true })); 

// app.use(upload.array()); 
// app.use(express.static('public'));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({ extended: false }),
  bodyParser.json({ limit: '50mb' })
);

app.use('/', routes);

app.listen(port, () => {
    console.log(`Listening to port ${port}`)
});