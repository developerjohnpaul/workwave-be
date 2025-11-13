
import { apiFailureResponse, apiSuccessResponse} from "../../clientFacingApi/models/index"
import CryptoJS from 'crypto-js'; 

export const cryptoAesKey  = process?.env?.CRYPTO_AES_KEY as string
export const ApiSuccessResponse = (data: any, message?: string): apiSuccessResponse<any> => {
    return {
        success: true,
        data,
        message
    }
}
export const ApiFailureResponse = (message: string): apiFailureResponse<any> => {
    return {
        success: false,
        message
    }
}

export const convertBitToBoolean = (bit:number) =>{
    return bit === 0 ? false :true
}
export const formattedDateAndTime = () => {
    const date = new Date();
    let month;
    switch (date.getMonth()) {
        case 0:
            month = "January";
            break;
        case 1:
            month = "February";
            break;
        case 2:
            month = "March";
            break;
        case 3:
            month = "April";
            break;
        case 4:
            month = "May";
            break;
        case 5:
            month = "June";
            break;
        case 6:
            month = "July";
            break;
        case 7:
            month = "August";
            break;
        case 8:
            month = "September";
            break;
        case 9:
            month = "October";
            break;
        case 10:
            month = "November";
            break;
        case 11:
            month = "December";
    }

    const formattedDate =
        date.getDate() + "th" + " " + month + " " + date.getFullYear();

    let hours = date.getHours();
    let minutes: number | string = date.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;

    let formattedTime = hours + ":" + minutes + " " + ampm;

    return { formattedTime, formattedDate };
};

// determin if a data is in json format
export const isValidJsonString = (val: any) => {
    try {
        JSON.parse(val);
        return true;
    } catch (err) {
        return false;
    }
}

export const slicedUserName = (email:string) => {
    let username = email.substring(0, email.indexOf("@"));
    let domain = email.substring(email.indexOf("@"));
    let slicedUsername =
      username.substring(0, 5) + "***" + username.charAt(username.length - 1);
    let result = slicedUsername + domain;
    return result;
  };

  //OTP 
 export const encryptData = (data:CryptoJS.lib.WordArray | string) => {
    const ciphertext = CryptoJS.AES.encrypt(data, cryptoAesKey).toString();
    return ciphertext;
  };
  
  // 2. Decrypt a message
 export  const decryptData = (ciphertext:string) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, cryptoAesKey);
    const originalMessage = bytes.toString(CryptoJS.enc.Utf8);
    return originalMessage;
  };
  

