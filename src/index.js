//const swaggerUi = require('swagger-ui-express')
//const jwt = require('jsonwebtoken');

//const express = require('express')

import swaggerUi from "swagger-ui-express";
import express from "express";
import { routesV1 } from "./v1/infrastructure/http/routes/index.js"
//import jwt from 'jsonwebtoken';

const app = express()

const port = process.env.PUBLIC_PORT
//import swaggerDocV1 from "./swaggerDocV1.json"
import swaggerDocV1 from "./swaggerDocV1.json" with {type: "json"};

//const swaggerDocV1 = require("./swaggerDocV1.json")
//const routesV1 = require('./infrastructure/http/v1/routes')
app.use(routesV1); 

app.listen(port, () => {
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocV1));
})
