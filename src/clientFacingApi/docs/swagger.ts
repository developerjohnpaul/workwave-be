import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

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
        url: "http://localhost:3010",
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

  // 👇 this is important based on your folder layout
  apis: ["./src/clientFacingApi/endpoints/**/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwaggerDocs(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("✅ Swagger Docs available at: http://localhost:3010/api-docs");
}
