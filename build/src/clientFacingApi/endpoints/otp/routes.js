"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contoller_1 = require("./contoller");
const otpRouter = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: OTP
 *   description: Endpoints for handling One-Time Passwords (OTP)
 */
// /**
//  * @swagger
//  * /otp/send/sms/{reciever}:
//  *   post:
//  *     summary: Send an OTP via SMS
//  *     tags: [OTP]
//  *     parameters:
//  *       - in: path
//  *         name: reciever
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The phone number of the OTP receiver
//  *     responses:
//  *       200:
//  *         description: OTP sent successfully via SMS
//  *       400:
//  *         description: Invalid phone number or failed to send OTP
//  */
// otpRouter.post("/send/sms/:reciever", sendSmsOtp);
/**
 * @swagger
 * /otp/send/mail/{reciever}:
 *   post:
 *     summary: Send an OTP via Email
 *     tags: [OTP]
 *     parameters:
 *       - in: path
 *         name: reciever
 *         required: true
 *         schema:
 *           type: string
 *         description: The email address of the OTP receiver
 *     responses:
 *       200:
 *         description: OTP sent successfully via email
 *       400:
 *         description: Invalid email or failed to send OTP
 */
otpRouter.post("/send/mail/:reciever", contoller_1.sendEmailOtp);
/**
 * @swagger
 * /otp/verify/{reciever}/{code}:
 *   post:
 *     summary: Verify an OTP code
 *     tags: [OTP]
 *     parameters:
 *       - in: path
 *         name: reciever
 *         required: true
 *         schema:
 *           type: string
 *         description: The phone number or email used to receive the OTP
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: The OTP code to verify
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP
 */
otpRouter.post("/verify/:reciever/:code", contoller_1.verifyOtp);
exports.default = otpRouter;
