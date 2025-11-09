"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successMessages = exports.errorMessages = exports.TokenEnum = exports.ClientOriginEnum = void 0;
var ClientOriginEnum;
(function (ClientOriginEnum) {
    ClientOriginEnum["prodServer"] = "https://aim-admin-dashboard-b9h6.onrender.com";
    ClientOriginEnum["localhost"] = "http://localhost:3000";
})(ClientOriginEnum || (exports.ClientOriginEnum = ClientOriginEnum = {}));
var TokenEnum;
(function (TokenEnum) {
    TokenEnum["refreshToken"] = "BBRFTBB";
    TokenEnum["accessToken"] = "BBACTBB";
})(TokenEnum || (exports.TokenEnum = TokenEnum = {}));
var errorMessages;
(function (errorMessages) {
    errorMessages["internalServerError"] = "Internal server error";
    errorMessages["fileNotFound"] = "File not found";
})(errorMessages || (exports.errorMessages = errorMessages = {}));
var successMessages;
(function (successMessages) {
    successMessages["succesfullFileUpload"] = "Files uploaded successfully";
    successMessages["succesfullFileRetrieval"] = "Files retrieved successfully";
})(successMessages || (exports.successMessages = successMessages = {}));
