const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

// YAML-Dateien laden
const swaggerAuth = YAML.load(path.join(__dirname, 'auth.yml'));
const swaggerAdmin = YAML.load(path.join(__dirname, 'admins.yml'));
const swaggerUser = YAML.load(path.join(__dirname, 'users.yml'));
const swaggerEvent = YAML.load(path.join(__dirname, 'events.yml'));

// Swagger-Dokumentation zusammenführen
const swaggerDocs = {
  openapi: '3.0.0',
  info: {
    title: 'API FORD FIESTA VERANSTALTUNGEN',
    version: '1.0.0',
    description: 'API Dokumentation mit Swagger',
  },
  servers: [
    {
      url: 'http://localhost:5050/api-ford-fiesta',
      description: 'Entwicklungsserver',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    ...swaggerAuth.paths,
    ...swaggerAdmin.paths,
    ...swaggerUser.paths,
    ...swaggerEvent.paths,
  },
};

module.exports = { swaggerUi, swaggerDocs };
