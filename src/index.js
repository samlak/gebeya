require('./config/config');
require('./db/mongoose');

const express = require('express');
const bodyParser = require('body-parser');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = require("../swagger.json")

const routes = require('./routes/index');

const app = express();

const port = process.env.PORT;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({ extended: false }),
  bodyParser.json({ limit: '50mb' })
);

const options = {
  explorer: true
}
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs, options));

app.use('/', routes);

app.use(
  function(req, res, next){
    res.status(404).send({
			status: "error",
	    data: "Page not Found"
		});
  }
);

app.listen(port, () => {
    console.log(`Listening to port ${port}`)
});