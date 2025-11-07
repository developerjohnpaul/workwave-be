import express from "express";
import {  sendEmailOtp, sendSmsOtp, verifyOtp} from "./contoller";
const otpRouter = express.Router();

otpRouter.post("/send/sms/:reciever", sendSmsOtp);
otpRouter.post("/send/mail/:reciever", sendEmailOtp);
otpRouter.post("/verify/:reciever/:code", verifyOtp);

export default otpRouter;
