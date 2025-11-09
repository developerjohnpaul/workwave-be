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
    host: process?.env?.db_auth_host,
    user: process?.env?.db_auth_user,
    password: process?.env?.db_auth_password,
    database: process?.env?.db_auth_database,
    port: process?.env?.db_auth_port,
});

export const conOperation = mysql.createPool({
    host: process?.env?.operation_db_auth_host,
    user: process?.env?.operation_db_auth_user,
    password: process?.env?.operation_db_auth_password,
    database: process?.env?.operation_db_auth_database,
    port: process?.env?.operation_db_auth_port,
});







