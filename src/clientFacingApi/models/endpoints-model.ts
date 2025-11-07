import { Request } from "express";
export type pagination = { page?: string, size?: string }
export interface getAudioSermonsRequestModel extends Request { params: pagination }



export interface signInRequestModel extends Request {
    body: {
        phoneNumber?: string,
        email?: string,
        pass: string,
    }
}

export interface signUpRequestModel extends Request {
    body: {
        fullName?: string,
        phoneNumber?: string,
        email?: string,
        pass?: string,
    }
}


export interface protectedRoutesRequest extends Request {
    verifiedToken?: { id: Number };
}

