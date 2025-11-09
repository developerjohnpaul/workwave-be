"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptData = exports.encryptData = exports.slicedUserName = exports.isValidJsonString = exports.formattedDateAndTime = exports.convertBitToBoolean = exports.ApiFailureResponse = exports.ApiSuccessResponse = exports.cryptoAesKey = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
exports.cryptoAesKey = process?.env?.crypto_aes_key;
const ApiSuccessResponse = (data, message) => {
    return {
        success: true,
        data,
        message
    };
};
exports.ApiSuccessResponse = ApiSuccessResponse;
const ApiFailureResponse = (message) => {
    return {
        success: false,
        message
    };
};
exports.ApiFailureResponse = ApiFailureResponse;
const convertBitToBoolean = (bit) => {
    return bit === 0 ? false : true;
};
exports.convertBitToBoolean = convertBitToBoolean;
const formattedDateAndTime = () => {
    const date = new Date();
    let month;
    switch (date.getMonth()) {
        case 0:
            month = "January";
            break;
        case 1:
            month = "February";
            break;
        case 2:
            month = "March";
            break;
        case 3:
            month = "April";
            break;
        case 4:
            month = "May";
            break;
        case 5:
            month = "June";
            break;
        case 6:
            month = "July";
            break;
        case 7:
            month = "August";
            break;
        case 8:
            month = "September";
            break;
        case 9:
            month = "October";
            break;
        case 10:
            month = "November";
            break;
        case 11:
            month = "December";
    }
    const formattedDate = date.getDate() + "th" + " " + month + " " + date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let formattedTime = hours + ":" + minutes + " " + ampm;
    return { formattedTime, formattedDate };
};
exports.formattedDateAndTime = formattedDateAndTime;
// determin if a data is in json format
const isValidJsonString = (val) => {
    try {
        JSON.parse(val);
        return true;
    }
    catch (err) {
        return false;
    }
};
exports.isValidJsonString = isValidJsonString;
const slicedUserName = (email) => {
    let username = email.substring(0, email.indexOf("@"));
    let domain = email.substring(email.indexOf("@"));
    let slicedUsername = username.substring(0, 5) + "***" + username.charAt(username.length - 1);
    let result = slicedUsername + domain;
    return result;
};
exports.slicedUserName = slicedUserName;
//OTP 
const encryptData = (data) => {
    const ciphertext = crypto_js_1.default.AES.encrypt(data, exports.cryptoAesKey).toString();
    return ciphertext;
};
exports.encryptData = encryptData;
// 2. Decrypt a message
const decryptData = (ciphertext) => {
    const bytes = crypto_js_1.default.AES.decrypt(ciphertext, exports.cryptoAesKey);
    const originalMessage = bytes.toString(crypto_js_1.default.enc.Utf8);
    return originalMessage;
};
exports.decryptData = decryptData;
