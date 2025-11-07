import { Response, Request, NextFunction } from 'express';

export interface queryInterface {
    sql?: string,
    req: Request,
    res: Response,
    next?: NextFunction,
    redirect?: boolean
}
export interface apiSuccessResponse<T> {
    success: true,
    data?: T,  
    message?: string,
    
}

export interface apiFailureResponse<T> {
    success: false,
    message?: T
}


export class userModel {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: number;
    pass?: string;
    accountCreateDate: Date;
    favoriteDevotionals?:string;
    favoriteAudioSermons?:string;
    isEmailVerified?:boolean;
    isPhoneNumberVeried?:boolean;
    verificationFlag?:boolean
}