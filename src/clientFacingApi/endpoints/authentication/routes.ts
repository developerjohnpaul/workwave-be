import express from "express";
import { currentUser, deleteAccount, resetPassword, signIn, signUp, verify } from "./controller";
import { authenticateToken } from "../../middleware/auth-tokens";
const authRouter = express.Router();

authRouter.post("/signUp/:method", signUp);
authRouter.post("/signIn/:method", signIn);
authRouter.get("/currentUser", authenticateToken, currentUser);
authRouter.put("/resetPassword/:method/:methodCredential/:newPassword", resetPassword);
authRouter.put("/verify/:method/:contactInformation", verify);
authRouter.delete("/delete/:method/:contactInformation", deleteAccount);



export default authRouter; 
