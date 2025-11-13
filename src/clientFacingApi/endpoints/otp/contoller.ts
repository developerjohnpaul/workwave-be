import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import { ApiFailureResponse, ApiSuccessResponse, decryptData, encryptData } from '../../utils/helpers';
import { errorMessages } from '../../models/enums';
import { transporter } from '../../utils/constants';
import { setCache, getCache, deleteCache, validateCache } from "../../server-storage/cache";
export const sendSmsOtp = async (req: Request, res: Response) => {

  try {
    const { reciever } = req.params
    const calc = Math.random();
    const otp = JSON.stringify(calc).slice(4, 8);
    if (validateCache(`otp:${reciever}`)) {
      res.status?.(StatusCodes?.OK)?.json(ApiSuccessResponse({ reciever }, "OTP has already been sent!"));
    } else {
      const data = {
        api_key: process.env.TERMII_API_KEY,
        message_type: "ALPHANUMERIC",
        to: `${reciever}`,
        from: "N-Alert",
        channel: "dnd",
        pin_attempts: 10,
        pin_time_to_live: 5,
        pin_length: 4,
        pin_placeholder: "8475",
        message_text: `Your Workwave confirmation code is ${otp}. It expires in 20 minutes, one-time use only.`,
        pin_type: "NUMERIC",
      };

      await axios.post('https://api.ng.termii.com/api/sms/otp/send', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(() => {
        setCache(`otp:${reciever}`, encryptData(otp));
        res.status(StatusCodes?.OK)?.json(ApiSuccessResponse({ reciever }, "OTP sent successfully"));
      }).catch(() => {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while sending OTP' });
      })
    }
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while sending OTP' });
  }
}


export const sendEmailOtp = async (req: Request, res: Response) => {
  const { reciever } = req.params
  const calc = Math.random();
  const otp = JSON.stringify(calc).slice(4, 8);
  if (validateCache(`otp:${reciever}`)) {
    res.status?.(StatusCodes?.OK)?.json(ApiSuccessResponse({ reciever }, "OTP has already been sent!"));
  } else {
    var mailOptions = {
      from: {
        name: "Workwave",
        address: "blime.invest@gmail.com",
      },
      to: `${reciever}`,
      subject: `Email Confirmation Code [${otp}]`,
      html: ` <h2>Email Confirmation </h2> 
            <div> 
             <p style="font-size:13px">Your Confirmation code is :</p>
              <h2>${otp} </h2>
              <p style="font-size:13px">Above  is your Workwave verification pin. It expires in 20 minutes, one time use only </p>
             <p>If you didn't make this request please ignore this mail </p>
            </div>
              `,
    };

    transporter.sendMail(mailOptions, function (err, response) {
      if (err) {
        console.log("Error_log",err)
         return res?.status(StatusCodes?.INTERNAL_SERVER_ERROR)?.json(ApiFailureResponse(errorMessages?.internalServerError)); 
       
      }
      setCache(`otp:${reciever}`, encryptData(otp));
      res.status?.(StatusCodes?.OK)?.json(ApiSuccessResponse({ reciever }, "OTP sent successfully"));
    });
  }
}

export const verifyOtp = (req: Request, res: Response) => {
  const { reciever, code } = req.params;
  if (validateCache(`otp:${reciever}`) && decryptData(getCache(`otp:${reciever}`)) == code) {
    res.status(StatusCodes?.OK)?.json(ApiSuccessResponse({ reciever }, "Otp verification sucessfull"));
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json(ApiFailureResponse('Invalid OTP code. Please try again.'));
  }
}