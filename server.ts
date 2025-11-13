import express from 'express';
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";
import { StatusCodes } from 'http-status-codes';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { Socket } from 'socket.io';
import authRouter from './src/clientFacingApi/endpoints/authentication/routes';
import otpRouter from './src/clientFacingApi/endpoints/otp/routes';
import { setupSwaggerDocs } from './src/clientFacingApi/docs/swagger';

const {Server}= require("socket.io")
dotenv.config();
const app = express();
// Swagger Docs
setupSwaggerDocs(app);
//port  
const ListeningPORT = process.env.ListeningPORT || 3010;
const server = 
app.listen(ListeningPORT, () => {
  console.log(`Server is running at http://localhost:${ListeningPORT}`);
});
//initializing socket.io server
const io = new Server(server, {
  cors: {
    origin: "*",
    requestCert: false,
    rejectUnauthorized: false,
    transports:
      ['websocket', 
        'flashsocket',
        'htmlfile',
        'xhr-polling',
        'jsonp-polling', 
        'polling']
  }
})
//creating a socket.io connection
io.on('connection', (socket:Socket) => {
  console.log(`A user connected ${socket?.id}`);
  socket.emit("test","testing socket emit ")
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


// Middleware
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(compression({ level: 5 }));
app.use(cookieParser());
app.use(bodyParser.json());
 
// Routes
app.use('/auth', authRouter);
app.use('/otp', otpRouter);

//landing page
app.get('/', (req, res) => {
  res.status(StatusCodes?.ACCEPTED)?.send('Welcome!');
});

export {io}
