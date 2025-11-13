import "dotenv/config";
import { Request, Response } from "express";
import { conUser } from "../../utils/constants"
import { StatusCodes } from "http-status-codes";
import { ApiFailureResponse, ApiSuccessResponse, convertBitToBoolean, decryptData } from "../../utils/helpers";
import { queryInterface, userModel } from "../../models/index";
import { initializeToken } from "../../middleware/auth-tokens";
import { MysqlError } from "mysql";
import { errorMessages, TokenEnum } from "../../models/enums";
import { protectedRoutesRequest, signInRequestModel, signUpRequestModel } from "../../models/endpoints-model";
import { getCache, validateCache } from "../../server-storage/cache";
enum methodEnum {
    google = "google",
    phoneNumber = "phoneNumber",
    email = "email"
}

export const signUp = (req: signUpRequestModel, res: Response) => {
    let method = req?.params?.method
    if ((!req.body.phoneNumber && method === methodEnum?.phoneNumber) || (!req.body.email && method === methodEnum?.email)) {
        return res?.status(StatusCodes?.BAD_REQUEST)?.json(ApiFailureResponse(` ${method === methodEnum?.email ? "Email address" : "Phone number"} is required`))
    }
    if (!req.body.pass && method != methodEnum?.google) return res?.status(StatusCodes?.BAD_REQUEST)?.json(ApiFailureResponse('Password cannot be empty'))
    let signUpQuery;
    switch (method) {
        case methodEnum?.phoneNumber:
            signUpQuery = `INSERT INTO users(fullName, phoneNumber,  pass)
        values("${req?.body?.fullName}", "${req?.body?.phoneNumber}", "${req?.body?.pass}");`
            break
        case methodEnum?.email:
            signUpQuery = `INSERT INTO users(fullName, email, pass)
        values("${req?.body?.fullName}", "${req?.body?.email}", "${req?.body?.pass}");`
            break
        case methodEnum?.google:
            signUpQuery = `INSERT INTO users(fullName, email)
        values("${req?.body?.fullName}", "${req?.body?.email}");`
    }
    conUser.query(signUpQuery, (err: MysqlError | null, result: any) => {

        if (err) {
            return err?.code === 'ER_DUP_ENTRY' ?
                res?.status(StatusCodes?.CONFLICT)?.json(ApiFailureResponse(`${method === methodEnum?.email ? "Email address" : "Phone number"} already in use`)) :
                res?.status(StatusCodes?.INTERNAL_SERVER_ERROR)?.json(ApiFailureResponse(errorMessages?.internalServerError));
        }
        signIn(req as signInRequestModel, res)
    })

}


export const deleteAccount = (req: Request, res: Response) => {
    let { method, contactInformation, code } = req?.params;
    if (validateCache(`otp:${contactInformation}`) && decryptData(getCache(`otp:${contactInformation}`)) == code) {
        let delQuery;
    switch (method) {
        case methodEnum?.phoneNumber:
            delQuery = `DELETE FROM users
            WHERE phoneNumber = ${contactInformation};`
            break
        case methodEnum?.email:
        case methodEnum?.google:
            delQuery = `DELETE FROM users
            WHERE email = "${contactInformation}";`
    }

    conUser.query(delQuery, (err: MysqlError | null, result: any) => {
        if (err) {
            return res?.status(StatusCodes?.BAD_REQUEST)?.json(ApiFailureResponse("Failed to delete account!"));
        }
        res.status(StatusCodes?.OK)?.json(ApiSuccessResponse(`Account deactivated successfully`))
    })
    } else {
        return res.status(StatusCodes.BAD_REQUEST).json(ApiFailureResponse('Invalid OTP code. Please try again.'));
    }
   

}

export const signIn = async (req: signInRequestModel, res: Response) => {

    let method = req?.params?.method;
    let sql;
    switch (method) {
        case methodEnum?.phoneNumber:
            sql = `SELECT DISTINCT * FROM users
              WHERE phoneNumber = ${req?.body?.phoneNumber} AND 
              pass = '${req?.body?.pass}' ;`
            break
        case methodEnum?.email:
            sql = `SELECT DISTINCT * FROM users 
            WHERE email = "${req?.body?.email}" AND 
              pass = '${req?.body?.pass}' ;`
            break
        case methodEnum?.google:
            sql = `SELECT DISTINCT * FROM users 
          WHERE email = "${req?.body?.email}";`
    }
    signInQuery({ sql, req, res, redirect: method === methodEnum?.google });
}

export const currentUser = (req: protectedRoutesRequest, res: Response) => {
    var sql = `SELECT DISTINCT * FROM users  
    where id = "${req?.verifiedToken?.id}"`;
    signInQuery({ sql, req, res, redirect: true });
}


export const signInQuery = ({ sql, req, res, redirect }: queryInterface) => {
    conUser.query(sql, (err: MysqlError | null, result: any) => {
        if (err) {
            console.log("err",process.env,process.env.DB_AUTH_HOST,err)
            return err?.code === 'ER_DUP_ENTRY' ?
                res?.status(StatusCodes?.CONFLICT)?.json(ApiFailureResponse('Account already exists')) :
                res?.status(StatusCodes?.INTERNAL_SERVER_ERROR)?.json(ApiFailureResponse(errorMessages?.internalServerError));
        }
        const resDetails = result?.[0];
        if ((!redirect) && !resDetails) {
            res?.status(StatusCodes?.OK)?.json(ApiFailureResponse("invalid credentials"));
            return;
        } else {
            if (resDetails) {
                const { id, fullName, email, phoneNumber, accountCreateDate, verificationFlag, isEmailVerified, favoriteAudioSermons, favoriteDevotionals } = resDetails
                const userDetailsObj: userModel = {
                    id,
                    fullName,
                    email,
                    phoneNumber,
                    accountCreateDate,
                    verificationFlag: convertBitToBoolean(verificationFlag),
                    isEmailVerified: convertBitToBoolean(isEmailVerified),
                    favoriteAudioSermons: favoriteAudioSermons?.split(",")?.map(Number) ?? [],
                    favoriteDevotionals: favoriteDevotionals?.split(",")?.map(Number) ?? [],
                };
                let token = initializeToken({ req, res, id })?.valueOf();
                token ? res.status(StatusCodes?.OK)?.json(ApiSuccessResponse({ token, user: userDetailsObj }, `Signin was successful.`)) :
                    res?.status(StatusCodes?.INTERNAL_SERVER_ERROR)?.json(ApiFailureResponse(errorMessages?.internalServerError))
            } else {
                res?.status(StatusCodes?.INTERNAL_SERVER_ERROR)?.json(ApiFailureResponse(errorMessages?.internalServerError))
            }
        }
    });
}


export const resetPassword = (req: protectedRoutesRequest, res: Response) => {
    let { method, newPassword, methodCredential,code } = req?.params;
    if (validateCache(`otp:${methodCredential}`) && decryptData(getCache(`otp:${methodCredential}`)) == code) {
        let sql;
    switch (method) {
        case methodEnum?.phoneNumber:
            sql = ` UPDATE users 
            SET pass = '${newPassword}'
            WHERE phoneNumber = ${methodCredential};`

            break
        case methodEnum?.email:
        case methodEnum?.google:
            sql = ` UPDATE users 
            SET pass = '${newPassword}'
            WHERE email = '${methodCredential}';`
    }

    conUser.query(sql, (err: MysqlError | null, result: any) => {
        if (err) { return res?.status(StatusCodes?.INTERNAL_SERVER_ERROR)?.json(ApiFailureResponse(errorMessages?.internalServerError)); }
        res.status(StatusCodes?.OK)?.json(ApiSuccessResponse(null, "Password reset successfully"));
    })
    } else {
        return res.status(StatusCodes.BAD_REQUEST).json(ApiFailureResponse('Session expired, please request a new OTP'));
    }
   
}


export const verify = (req: protectedRoutesRequest, res: Response) => {
    let { method, contactInformation, code } = req?.params;
    if (validateCache(`otp:${contactInformation}`) && decryptData(getCache(`otp:${contactInformation}`)) == code) {
        let sql;
        switch (method) {
            case methodEnum?.phoneNumber:
                sql = ` UPDATE users 
            SET verificationFlag = 1, isPhoneNumberVeried = 1 
           WHERE phoneNumber = ${contactInformation} ;`

                break
            case methodEnum?.email:
                sql = `UPDATE users 
            SET verificationFlag = 1, isEmailVerified = 1
           WHERE email = "${contactInformation}";`
        }

        conUser.query(sql, (err: MysqlError | null, result: any) => {
            if (err) { return res?.status(StatusCodes?.INTERNAL_SERVER_ERROR)?.json(ApiFailureResponse("Contact verification failed, please try again later")); }
            res.status(StatusCodes?.OK)?.json(ApiSuccessResponse(null, "Contact verified successfully"));
        })
    } else {
        return res.status(StatusCodes.BAD_REQUEST).json(ApiFailureResponse('Invalid OTP code. Please try again.'));
    }

}
