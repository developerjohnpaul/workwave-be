"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./src/clientFacingApi/endpoints/authentication/routes"));
const http_status_codes_1 = require("http-status-codes");
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const routes_2 = __importDefault(require("./src/clientFacingApi/endpoints/otp/routes"));
const swagger_1 = require("./src/clientFacingApi/docs/swagger");
const { Server } = require("socket.io");
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, swagger_1.setupSwaggerDocs)(app);
//port  
const PORT = process?.env?.PORT || 3010;
const server = app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
//initializing socket.io server
const io = new Server(server, {
    cors: {
        origin: "*",
        requestCert: false,
        rejectUnauthorized: false,
        transports: ['websocket',
            'flashsocket',
            'htmlfile',
            'xhr-polling',
            'jsonp-polling',
            'polling']
    }
});
exports.io = io;
//creating a socket.io connection
io.on('connection', (socket) => {
    console.log(`A user connected ${socket?.id}`);
    socket.emit("test", "testing socket emit ");
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
// Middleware
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true
}));
app.use((0, compression_1.default)({ level: 5 }));
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
// Client facing routes 
app.use("/auth", routes_1.default);
app.use("/otp", routes_2.default);
//landing page
app.get('/', (req, res) => {
    res.status(http_status_codes_1.StatusCodes?.ACCEPTED)?.send('Welcome!');
});
