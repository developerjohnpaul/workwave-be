"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.sendEmailOtp = exports.sendSmsOtp = void 0;
const axios_1 = __importDefault(require("axios"));
const http_status_codes_1 = require("http-status-codes");
const helpers_1 = require("../../utils/helpers");
const enums_1 = require("../../models/enums");
const constants_1 = require("../../utils/constants");
const cache_1 = require("../../server-storage/cache");
const sendSmsOtp = async (req, res) => {
    try {
        const { reciever } = req.params;
        const calc = Math.random();
        const otp = JSON.stringify(calc).slice(4, 8);
        if ((0, cache_1.validateCache)(`otp:${reciever}`)) {
            res.status?.(http_status_codes_1.StatusCodes?.OK)?.json((0, helpers_1.ApiSuccessResponse)({ reciever }, "OTP has already been sent!"));
        }
        else {
            const data = {
                api_key: process.env.termii_api_key,
                message_type: "ALPHANUMERIC",
                to: `${reciever}`,
                from: "N-Alert",
                channel: "dnd",
                pin_attempts: 10,
                pin_time_to_live: 5,
                pin_length: 4,
                pin_placeholder: "8475",
                message_text: `Your Workwave confirmation code is ${otp}. It expires in 20 minutes, one-time use only.`,
                pin_type: "NUMERIC",
            };
            await axios_1.default.post('https://api.ng.termii.com/api/sms/otp/send', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(() => {
                (0, cache_1.setCache)(`otp:${reciever}`, (0, helpers_1.encryptData)(otp));
                res.status(http_status_codes_1.StatusCodes?.OK)?.json((0, helpers_1.ApiSuccessResponse)({ reciever }, "OTP sent successfully"));
            }).catch(() => {
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while sending OTP' });
            });
        }
    }
    catch (err) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while sending OTP' });
    }
};
exports.sendSmsOtp = sendSmsOtp;
const sendEmailOtp = async (req, res) => {
    const { reciever } = req.params;
    const calc = Math.random();
    const otp = JSON.stringify(calc).slice(4, 8);
    if ((0, cache_1.validateCache)(`otp:${reciever}`)) {
        res.status?.(http_status_codes_1.StatusCodes?.OK)?.json((0, helpers_1.ApiSuccessResponse)({ reciever }, "OTP has already been sent!"));
    }
    else {
        var mailOptions = {
            from: {
                name: "Workwave",
                address: "blime.invest@gmail.com",
            },
            to: `${reciever}`,
            subject: `Email Confirmation Code [${otp}]`,
            html: ` <h2>Email Confirmation </h2> 
            <div> 
             <p style="font-size:13px">Your Confirmation code is :</p>
              <h2>${otp} </h2>
              <p style="font-size:13px">Above  is your Workwave verification pin. It expires in 20 minutes, one time use only </p>
             <p>If you didn't make this request please ignore this mail </p>
            </div>
              `,
        };
        constants_1.transporter.sendMail(mailOptions, function (err, response) {
            if (err) {
                return res?.status(http_status_codes_1.StatusCodes?.INTERNAL_SERVER_ERROR)?.json((0, helpers_1.ApiFailureResponse)(enums_1.errorMessages?.internalServerError));
            }
            (0, cache_1.setCache)(`otp:${reciever}`, (0, helpers_1.encryptData)(otp));
            res.status?.(http_status_codes_1.StatusCodes?.OK)?.json((0, helpers_1.ApiSuccessResponse)({ reciever }, "OTP sent successfully"));
        });
    }
};
exports.sendEmailOtp = sendEmailOtp;
const verifyOtp = (req, res) => {
    const { reciever, code } = req.params;
    if ((0, cache_1.validateCache)(`otp:${reciever}`) && (0, helpers_1.decryptData)((0, cache_1.getCache)(`otp:${reciever}`)) == code) {
        res.status(http_status_codes_1.StatusCodes?.OK)?.json((0, helpers_1.ApiSuccessResponse)({ reciever }, "Otp verification sucessfull"));
    }
    else {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, helpers_1.ApiFailureResponse)('Invalid OTP code. Please try again.'));
    }
};
exports.verifyOtp = verifyOtp;
