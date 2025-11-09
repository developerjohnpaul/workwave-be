"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = exports.initializeToken = void 0;
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const enums_1 = require("../models/enums");
const helpers_1 = require("../../clientFacingApi/utils/helpers");
const initializeToken = ({ id }) => {
    try {
        if (!process.env.jwt_secret_key)
            return false;
        const accessToken = jsonwebtoken_1.default.sign({ id }, process.env.jwt_secret_key, { expiresIn: "8h" });
        return accessToken;
    }
    catch {
        return false;
    }
};
exports.initializeToken = initializeToken;
const authenticateToken = (req, res, next) => {
    if (!process.env.jwt_secret_key) {
        return res?.status(http_status_codes_1.StatusCodes?.INTERNAL_SERVER_ERROR)?.json((0, helpers_1.ApiFailureResponse)(enums_1.errorMessages?.internalServerError));
    }
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader ? authHeader.split(" ")[1] : "";
    jsonwebtoken_1.default.verify(accessToken, process.env.jwt_secret_key, (error, decryptedAccessToken) => {
        if (error) {
            if (!process.env.jwt_secret_key) {
                return res?.status(http_status_codes_1.StatusCodes?.INTERNAL_SERVER_ERROR)?.json((0, helpers_1.ApiFailureResponse)(enums_1.errorMessages?.internalServerError));
            }
            return res?.status(http_status_codes_1.StatusCodes?.UNAUTHORIZED)?.json((0, helpers_1.ApiFailureResponse)("Session expired"));
        }
        else {
            req.verifiedToken = decryptedAccessToken;
            next();
        }
    });
};
exports.authenticateToken = authenticateToken;
