"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contoller_1 = require("./contoller");
const otpRouter = express_1.default.Router();
otpRouter.post("/send/sms/:reciever", contoller_1.sendSmsOtp);
otpRouter.post("/send/mail/:reciever", contoller_1.sendEmailOtp);
otpRouter.post("/verify/:reciever/:code", contoller_1.verifyOtp);
exports.default = otpRouter;
