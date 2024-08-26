const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

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
    apis: [path.join(__dirname, 'swaggerEndpoints.js')] // Separate Dokumentationsdatei einbinden
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };
