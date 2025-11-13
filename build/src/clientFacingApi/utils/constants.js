"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conOperation = exports.conUser = exports.transporter = exports.mysql = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.mysql = require("mysql");
{
    /**************************** transporter ********************************** */
}
exports.transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "blime.invest@gmail.com",
        pass: "wfrzgenbqozvyrhv",
    }
});
{
    /**************************** Database Cred ********************************** */
}
exports.conUser = exports.mysql.createPool({
    host: process?.env?.DB_AUTH_HOST,
    user: process?.env?.DB_AUTH_USER,
    password: process?.env?.DB_AUTH_PASSWORD,
    database: process?.env?.DB_AUTH_DATABASE,
    port: process?.env?.DB_AUTH_PORT
});
exports.conOperation = exports.mysql.createPool({
    host: process?.env?.operation_DB_AUTH_HOST,
    user: process?.env?.operation_DB_AUTH_USER,
    password: process?.env?.operation_DB_AUTH_PASSWORD,
    database: process?.env?.operation_DB_AUTH_DATABASE,
    port: process?.env?.operation_DB_AUTH_PORT,
});
