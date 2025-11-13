import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthMethod:
 *       type: string
 *       enum:
 *         - email
 *         - google
 */

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Workwave API Documentation",
      version: "1.0.0",
      description: "API documentation for the Workwave backend",
    },
    servers: [
      {
        url: process.env.API_BASE_URL,
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/clientFacingApi/endpoints/**/*.ts", "./src/clientFacingApi/docs/swagger.ts"], // 👈 include this file itself
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwaggerDocs(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`✅ Swagger Docs available at: ${process.env.API_BASE_URL}/api-docs`);
}
