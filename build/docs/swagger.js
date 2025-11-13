"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwaggerDocs = setupSwaggerDocs;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
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
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
function setupSwaggerDocs(app) {
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    console.log(`✅ Swagger Docs available at: ${process.env.API_BASE_URL}/api-docs`);
}
