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
    service: "gmail",
    auth: {
        user: "blime.invest@gmail.com",
        pass: "wfrzgenbqozvyrhv",
    }
});
{
    /**************************** Database Cred ********************************** */
}
exports.conUser = exports.mysql.createPool({
    host: process?.env?.db_auth_host,
    user: process?.env?.db_auth_user,
    password: process?.env?.db_auth_password,
    database: process?.env?.db_auth_database,
    port: process?.env?.db_auth_port,
});
exports.conOperation = exports.mysql.createPool({
    host: process?.env?.operation_db_auth_host,
    user: process?.env?.operation_db_auth_user,
    password: process?.env?.operation_db_auth_password,
    database: process?.env?.operation_db_auth_database,
    port: process?.env?.operation_db_auth_port,
});
