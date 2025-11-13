import nodemailer from "nodemailer";
export const mysql = require("mysql");
{
    /**************************** transporter ********************************** */
}
export const transporter = nodemailer.createTransport({
    host: process?.env?.SMTP_HOST,
    port:  Number(process?.env?.SMTP_PORT),
    secure:false,
    auth: {
    user: process?.env?.SMTP_USER,
    pass: process?.env?.SMTP_PASS,
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
    port: process?.env?.DB_AUTH_PORT
});

export const conOperation = mysql.createPool({
    host: process?.env?.operation_DB_AUTH_HOST,
    user: process?.env?.operation_DB_AUTH_USER,
    password: process?.env?.operation_DB_AUTH_PASSWORD,
    database: process?.env?.operation_DB_AUTH_DATABASE,
    port: process?.env?.operation_DB_AUTH_PORT,
});







