"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
const auth_tokens_1 = require("../../middleware/auth-tokens");
const authRouter = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */
/**
 * @swagger
 * /auth/signUp/{method}:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: method
 *         required: true
 *         schema:
 *           type: string
 *         description: The signup method (e.g., email, phone)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               pass:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */
authRouter.post("/signUp/:method", controller_1.signUp);
/**
 * @swagger
 * /auth/signIn/{method}:
 *   post:
 *     summary: Sign in a user
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: method
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               pass:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 */
authRouter.post("/signIn/:method", controller_1.signIn);
/**
 * @swagger
 * /auth/currentUser:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The current logged-in user
 *       401:
 *         description: Unauthorized
 */
authRouter.get("/currentUser", auth_tokens_1.authenticateToken, controller_1.currentUser);
/**
 * @swagger
 * /auth/resetPassword/{method}/{methodCredential}/{newPassword}:
 *   put:
 *     summary: Reset a user's password
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: method
 *         schema:
 *           type: string
 *       - in: path
 *         name: methodCredential
 *         schema:
 *           type: string
 *       - in: path
 *         name: newPassword
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
authRouter.put("/resetPassword/:method/:methodCredential/:newPassword", controller_1.resetPassword);
/**
 * @swagger
 * /auth/verify/{method}/{contactInformation}/{code}:
 *   put:
 *     summary: Verify a user’s contact information
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: method
 *         schema:
 *           type: string
 *       - in: path
 *         name: contactInformation
 *         schema:
 *           type: string
 *       - in: path
 *         name: code
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Verification successful
 *       400:
 *         description: Invalid code
 */
authRouter.put("/verify/:method/:contactInformation/:code", controller_1.verify);
/**
 * @swagger
 * /auth/delete/{method}/{contactInformation}:
 *   delete:
 *     summary: Delete a user account
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: method
 *         schema:
 *           type: string
 *       - in: path
 *         name: contactInformation
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account deleted
 *       404:
 *         description: User not found
 */
authRouter.delete("/delete/:method/:contactInformation", controller_1.deleteAccount);
exports.default = authRouter;
