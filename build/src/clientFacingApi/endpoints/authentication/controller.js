"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = exports.resetPassword = exports.signInQuery = exports.test = exports.currentUser = exports.signIn = exports.deleteAccount = exports.signUp = void 0;
require("dotenv/config");
const constants_1 = require("../../utils/constants");
const http_status_codes_1 = require("http-status-codes");
const helpers_1 = require("../../utils/helpers");
const auth_tokens_1 = require("../../middleware/auth-tokens");
const enums_1 = require("../../models/enums");
const cache_1 = require("../../server-storage/cache");
var methodEnum;
(function (methodEnum) {
    methodEnum["google"] = "google";
    methodEnum["phoneNumber"] = "phoneNumber";
    methodEnum["email"] = "email";
})(methodEnum || (methodEnum = {}));
const signUp = (req, res) => {
    let method = req?.params?.method;
    if ((!req.body.phoneNumber && method === methodEnum?.phoneNumber) || (!req.body.email && method === methodEnum?.email)) {
        return res?.status(http_status_codes_1.StatusCodes?.BAD_REQUEST)?.json((0, helpers_1.ApiFailureResponse)(` ${method === methodEnum?.email ? "Email address" : "Phone number"} is required`));
    }
    if (!req.body.pass && method != methodEnum?.google)
        return res?.status(http_status_codes_1.StatusCodes?.BAD_REQUEST)?.json((0, helpers_1.ApiFailureResponse)('Password cannot be empty'));
    let signUpQuery;
    switch (method) {
        case methodEnum?.phoneNumber:
            signUpQuery = `INSERT INTO users(fullName, phoneNumber,  pass)
        values("${req?.body?.fullName}", "${req?.body?.phoneNumber}", "${req?.body?.pass}");`;
            break;
        case methodEnum?.email:
            signUpQuery = `INSERT INTO users(fullName, email, pass)
        values("${req?.body?.fullName}", "${req?.body?.email}", "${req?.body?.pass}");`;
            break;
        case methodEnum?.google:
            signUpQuery = `INSERT INTO users(fullName, email)
        values("${req?.body?.fullName}", "${req?.body?.email}");`;
    }
    constants_1.conUser.query(signUpQuery, (err, result) => {
        if (err) {
            return err?.code === 'ER_DUP_ENTRY' ?
                res?.status(http_status_codes_1.StatusCodes?.CONFLICT)?.json((0, helpers_1.ApiFailureResponse)(`${method === methodEnum?.email ? "Email address" : "Phone number"} already in use`)) :
                res?.status(http_status_codes_1.StatusCodes?.INTERNAL_SERVER_ERROR)?.json((0, helpers_1.ApiFailureResponse)(enums_1.errorMessages?.internalServerError));
        }
        (0, exports.signIn)(req, res);
    });
};
exports.signUp = signUp;
const deleteAccount = (req, res) => {
    let { method, contactInformation, code } = req?.params;
    if ((0, cache_1.validateCache)(`otp:${contactInformation}`) && (0, helpers_1.decryptData)((0, cache_1.getCache)(`otp:${contactInformation}`)) == code) {
        let delQuery;
        switch (method) {
            case methodEnum?.phoneNumber:
                delQuery = `DELETE FROM users
            WHERE phoneNumber = ${contactInformation};`;
                break;
            case methodEnum?.email:
            case methodEnum?.google:
                delQuery = `DELETE FROM users
            WHERE email = "${contactInformation}";`;
        }
        constants_1.conUser.query(delQuery, (err, result) => {
            if (err) {
                return res?.status(http_status_codes_1.StatusCodes?.BAD_REQUEST)?.json((0, helpers_1.ApiFailureResponse)("Failed to delete account!"));
            }
            res.status(http_status_codes_1.StatusCodes?.OK)?.json((0, helpers_1.ApiSuccessResponse)(`Account deactivated successfully`));
        });
    }
    else {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, helpers_1.ApiFailureResponse)('Invalid OTP code. Please try again.'));
    }
};
exports.deleteAccount = deleteAccount;
const signIn = async (req, res) => {
    let method = req?.params?.method;
    let sql;
    switch (method) {
        case methodEnum?.phoneNumber:
            sql = `SELECT DISTINCT * FROM users
              WHERE phoneNumber = ${req?.body?.phoneNumber} AND 
              pass = '${req?.body?.pass}' ;`;
            break;
        case methodEnum?.email:
            sql = `SELECT DISTINCT * FROM users 
            WHERE email = "${req?.body?.email}" AND 
              pass = '${req?.body?.pass}' ;`;
            break;
        case methodEnum?.google:
            sql = `SELECT DISTINCT * FROM users 
          WHERE email = "${req?.body?.email}";`;
    }
    (0, exports.signInQuery)({ sql, req, res, redirect: method === methodEnum?.google });
};
exports.signIn = signIn;
const currentUser = (req, res) => {
    var sql = `SELECT DISTINCT * FROM users  
    where id = "${req?.verifiedToken?.id}"`;
    (0, exports.signInQuery)({ sql, req, res, redirect: true });
};
exports.currentUser = currentUser;
const test = (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
};
exports.test = test;
const signInQuery = ({ sql, req, res, redirect }) => {
    console.log("conUser", {
        host: process?.env?.DB_AUTH_HOST,
        user: process?.env?.DB_AUTH_USER,
        password: process?.env?.DB_AUTH_PASSWORD,
        database: process?.env?.DB_AUTH_DATABASE,
        port: process?.env?.DB_AUTH_PORT
    }, constants_1.conUser);
    constants_1.conUser.query(sql, (err, result) => {
        if (err) {
            return err?.code === 'ER_DUP_ENTRY' ?
                res?.status(http_status_codes_1.StatusCodes?.CONFLICT)?.json((0, helpers_1.ApiFailureResponse)('Account already exists')) :
                res?.status(http_status_codes_1.StatusCodes?.INTERNAL_SERVER_ERROR)?.json((0, helpers_1.ApiFailureResponse)(enums_1.errorMessages?.internalServerError));
        }
        const resDetails = result?.[0];
        if ((!redirect) && !resDetails) {
            res?.status(http_status_codes_1.StatusCodes?.OK)?.json((0, helpers_1.ApiFailureResponse)("invalid credentials"));
            return;
        }
        else {
            if (resDetails) {
                const { id, fullName, email, phoneNumber, accountCreateDate, verificationFlag, isEmailVerified, favoriteAudioSermons, favoriteDevotionals } = resDetails;
                const userDetailsObj = {
                    id,
                    fullName,
                    email,
                    phoneNumber,
                    accountCreateDate,
                    verificationFlag: (0, helpers_1.convertBitToBoolean)(verificationFlag),
                    isEmailVerified: (0, helpers_1.convertBitToBoolean)(isEmailVerified),
                    favoriteAudioSermons: favoriteAudioSermons?.split(",")?.map(Number) ?? [],
                    favoriteDevotionals: favoriteDevotionals?.split(",")?.map(Number) ?? [],
                };
                let token = (0, auth_tokens_1.initializeToken)({ req, res, id })?.valueOf();
                token ? res.status(http_status_codes_1.StatusCodes?.OK)?.json((0, helpers_1.ApiSuccessResponse)({ token, user: userDetailsObj }, `Signin was successful.`)) :
                    res?.status(http_status_codes_1.StatusCodes?.INTERNAL_SERVER_ERROR)?.json((0, helpers_1.ApiFailureResponse)(enums_1.errorMessages?.internalServerError));
            }
            else {
                res?.status(http_status_codes_1.StatusCodes?.INTERNAL_SERVER_ERROR)?.json((0, helpers_1.ApiFailureResponse)(enums_1.errorMessages?.internalServerError));
            }
        }
    });
};
exports.signInQuery = signInQuery;
const resetPassword = (req, res) => {
    let { method, newPassword, methodCredential, code } = req?.params;
    if ((0, cache_1.validateCache)(`otp:${methodCredential}`) && (0, helpers_1.decryptData)((0, cache_1.getCache)(`otp:${methodCredential}`)) == code) {
        let sql;
        switch (method) {
            case methodEnum?.phoneNumber:
                sql = ` UPDATE users 
            SET pass = '${newPassword}'
            WHERE phoneNumber = ${methodCredential};`;
                break;
            case methodEnum?.email:
            case methodEnum?.google:
                sql = ` UPDATE users 
            SET pass = '${newPassword}'
            WHERE email = '${methodCredential}';`;
        }
        constants_1.conUser.query(sql, (err, result) => {
            if (err) {
                return res?.status(http_status_codes_1.StatusCodes?.INTERNAL_SERVER_ERROR)?.json((0, helpers_1.ApiFailureResponse)(enums_1.errorMessages?.internalServerError));
            }
            res.status(http_status_codes_1.StatusCodes?.OK)?.json((0, helpers_1.ApiSuccessResponse)(null, "Password reset successfully"));
        });
    }
    else {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, helpers_1.ApiFailureResponse)('Session expired, please request a new OTP'));
    }
};
exports.resetPassword = resetPassword;
const verify = (req, res) => {
    let { method, contactInformation, code } = req?.params;
    if ((0, cache_1.validateCache)(`otp:${contactInformation}`) && (0, helpers_1.decryptData)((0, cache_1.getCache)(`otp:${contactInformation}`)) == code) {
        let sql;
        switch (method) {
            case methodEnum?.phoneNumber:
                sql = ` UPDATE users 
            SET verificationFlag = 1, isPhoneNumberVeried = 1 
           WHERE phoneNumber = ${contactInformation} ;`;
                break;
            case methodEnum?.email:
                sql = `UPDATE users 
            SET verificationFlag = 1, isEmailVerified = 1
           WHERE email = "${contactInformation}";`;
        }
        constants_1.conUser.query(sql, (err, result) => {
            if (err) {
                return res?.status(http_status_codes_1.StatusCodes?.INTERNAL_SERVER_ERROR)?.json((0, helpers_1.ApiFailureResponse)("Contact verification failed, please try again later"));
            }
            res.status(http_status_codes_1.StatusCodes?.OK)?.json((0, helpers_1.ApiSuccessResponse)(null, "Contact verified successfully"));
        });
    }
    else {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, helpers_1.ApiFailureResponse)('Invalid OTP code. Please try again.'));
    }
};
exports.verify = verify;
