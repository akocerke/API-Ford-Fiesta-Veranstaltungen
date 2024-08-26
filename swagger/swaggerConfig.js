const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API FORD FIESTA VERANSTALTUNGEN',
            version: '1.0.0',
            description: 'API Dokumentation mit Swagger'
        },
        servers: [
            {
                url: 'http://localhost:5050/api-ford-fiesta',
                description: 'Entwicklungsserver'
            }
        ]
        
    },
    apis: ['./routes/**/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };
