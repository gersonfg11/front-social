import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Periferia Social API',
      version: '1.0.0',
      description: 'API de red social para prueba técnica Periferia IT'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['src/modules/**/*.routes.ts']
};

export const swaggerSpec = swaggerJSDoc(options);
