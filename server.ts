import express, { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
import authRouter from './src/clientFacingApi/endpoints/authentication/routes';
import otpRouter from './src/clientFacingApi/endpoints/otp/routes';
import { setupSwaggerDocs } from './src/clientFacingApi/docs/swagger';
import { StatusCodes } from 'http-status-codes';

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(compression({ level: 5 }));
app.use(cookieParser());
app.use(bodyParser.json());

// Swagger Docs
setupSwaggerDocs(app);

// Routes
app.use('/auth', authRouter);
app.use('/otp', otpRouter);

app.get('/', (_req: Request, res: Response) => {
  res.status(StatusCodes.ACCEPTED).send('Welcome!');
});

// Test route (DB-less)
app.get('/test', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('🔥 Express Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Use Render port
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3010;
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
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
