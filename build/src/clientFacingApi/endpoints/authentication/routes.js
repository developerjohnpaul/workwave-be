"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
const auth_tokens_1 = require("../../middleware/auth-tokens");
const authRouter = express_1.default.Router();
authRouter.post("/signUp/:method", controller_1.signUp);
authRouter.post("/signIn/:method", controller_1.signIn);
authRouter.get("/currentUser", auth_tokens_1.authenticateToken, controller_1.currentUser);
authRouter.put("/resetPassword/:method/:methodCredential/:newPassword", controller_1.resetPassword);
authRouter.put("/verify/:method/:contactInformation/:code", controller_1.verify);
authRouter.delete("/delete/:method/:contactInformation", controller_1.deleteAccount);
exports.default = authRouter;
