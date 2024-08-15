//const swaggerAutogen = require('swagger-autogen');
import swaggerAutogen from "swagger-autogen";
const outputFile = './swaggerDocV1.json';
const endpointsFiles = ['./infrastructure/http/v1/routes/index.js']; // root file where the route starts.

const doc = {
    info: {
        version: 'v1.0.0',
        title: 'Swagger Demo Project',
        description: 'Implementation of Swagger'
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
            }
        }
    }
};

swaggerAutogen({openapi: '3.1.0'})(outputFile, endpointsFiles,doc).then(() => {
      //require('./index.js'); // Your project's root file
})
