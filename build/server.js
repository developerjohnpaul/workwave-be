"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const routes_1 = __importDefault(require("./src/clientFacingApi/endpoints/authentication/routes"));
const routes_2 = __importDefault(require("./src/clientFacingApi/endpoints/otp/routes"));
const swagger_1 = require("./src/clientFacingApi/docs/swagger");
const http_status_codes_1 = require("http-status-codes");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({ origin: '*', credentials: true }));
app.use((0, compression_1.default)({ level: 5 }));
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
// Swagger Docs
(0, swagger_1.setupSwaggerDocs)(app);
// Routes
app.use('/auth', routes_1.default);
app.use('/otp', routes_2.default);
app.get('/', (_req, res) => {
    res.status(http_status_codes_1.StatusCodes.ACCEPTED).send('Welcome!');
});
// Test route (DB-less)
app.get('/test', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});
// Global error handler
app.use((err, _req, res, _next) => {
    console.error('🔥 Express Error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});
// Use Render port
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3010;
const server = http_1.default.createServer(app);
// Socket.io setup
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        credentials: true,
    },
    transports: ['websocket', 'polling'], // simplified
});
io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);
    socket.emit('test', 'testing socket emit');
    socket.on('disconnect', () => console.log(`User disconnected: ${socket.id}`));
});
// Start server
server.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`Swagger available at ${process.env.API_BASE_URL || `http://localhost:${PORT}`}/api-docs`);
});
