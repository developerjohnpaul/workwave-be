import nodemailer from "nodemailer";
export const mysql = require("mysql");
{
    /**************************** transporter ********************************** */
}
export const transporter = nodemailer.createTransport({
    service: "gmail",
  auth: {
    user: "blime.invest@gmail.com",
    pass: "wfrzgenbqozvyrhv",
  }
});

{
    /**************************** Database Cred ********************************** */
}

export const conUser = mysql.createPool({
    host: process?.env?.DB_AUTH_HOST,
    user: process?.env?.DB_AUTH_USER,
    password: process?.env?.DB_AUTH_PASSWORD,
    database: process?.env?.DB_AUTH_DATABASE,
    port: process?.env?.DB_AUTH_PORT,
});

export const conOperation = mysql.createPool({
    host: process?.env?.operation_DB_AUTH_HOST,
    user: process?.env?.operation_DB_AUTH_USER,
    password: process?.env?.operation_DB_AUTH_PASSWORD,
    database: process?.env?.operation_DB_AUTH_DATABASE,
    port: process?.env?.operation_DB_AUTH_PORT,
});







