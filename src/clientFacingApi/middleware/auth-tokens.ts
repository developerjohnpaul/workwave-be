import { Response, Request, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from "jsonwebtoken"
import {  errorMessages } from '../models/enums';
import { ApiFailureResponse } from '../../clientFacingApi/utils/helpers';
import { protectedRoutesRequest } from '../../clientFacingApi/models/endpoints-model';

interface authMiddleware {
    req: Request,
    res: Response,
    id: number
}

export const initializeToken = ({ id }: authMiddleware) => {
    try {
        if (!process.env.JWT_SECRET_KEY) return false
        const accessToken = jwt.sign(
            { id }, process.env.JWT_SECRET_KEY, { expiresIn: "8h" }
        );
        return accessToken
    }
    catch {
        return false;
    }
}


export const authenticateToken = (req: protectedRoutesRequest, res: Response, next: NextFunction) => {
    if (!process.env.JWT_SECRET_KEY) { return res?.status(StatusCodes?.INTERNAL_SERVER_ERROR)?.json(ApiFailureResponse(errorMessages?.internalServerError)) }
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader ? authHeader.split(" ")[1] : "";
    jwt.verify(
        accessToken,
        process.env.JWT_SECRET_KEY,
        (error: jwt.VerifyErrors | null, decryptedAccessToken: any) => {
            if (error) {
                if (!process.env.JWT_SECRET_KEY) { return res?.status(StatusCodes?.INTERNAL_SERVER_ERROR)?.json(ApiFailureResponse(errorMessages?.internalServerError)) }
                return res?.status(StatusCodes?.UNAUTHORIZED)?.json(ApiFailureResponse("Session expired"))
            } else {
                req.verifiedToken = decryptedAccessToken;
                next();
            }
        }
    );
};

