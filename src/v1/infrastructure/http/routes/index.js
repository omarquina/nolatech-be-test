//const swaggerAutogen = require('swagger-autogen');
//import swaggerAutogen from "swagger-autogen";
//const userRouter = require("./user.routes.js")
import express from "express"
import { router as userRouter } from "./user.routes.js"
//const outputFile = './swaggerDocV1.json';
//const endpointsFiles = ['./routes.js']; // root file where the route starts.

// const express = require("express");
export const routesV1 = express.Router();
const prefixV1 = "/api/v1/"
const usersEndpoints =`#{prefixV1}users`; 
//const userRouter = require("./user.routes.js")

routesV1.use('/api/v1/users',userRouter);

//module.exports = router;
