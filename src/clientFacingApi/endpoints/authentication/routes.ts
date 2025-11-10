import express from "express";
import {
  currentUser,
  deleteAccount,
  resetPassword,
  signIn,
  signUp,
  verify,
} from "./controller";
import { authenticateToken } from "../../middleware/auth-tokens";

const authRouter = express.Router();

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
 *           $ref: '#/components/schemas/AuthMethod'
 *         description: The signup method (email, phoneNumber, or google)
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
authRouter.post("/signUp/:method", signUp);

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
 *           $ref: '#/components/schemas/AuthMethod'
 *         description: The sign-in method (email, phoneNumber, or google)
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
authRouter.post("/signIn/:method", signIn);

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
authRouter.get("/currentUser", authenticateToken, currentUser);

/**
 * @swagger
 * /auth/resetPassword/{method}/{methodCredential}/{newPassword}/{code}:
 *   put:
 *     summary: Reset a user's password
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: method
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/AuthMethod'
 *       - in: path
 *         name: methodCredential
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's email or phone number
 *       - in: path
 *         name: newPassword
 *         required: true
 *         schema:
 *           type: string
 *         description: The new password
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: The verification code sent to the user
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid parameters
 */
authRouter.put(
  "/resetPassword/:method/:methodCredential/:newPassword/:code",
  resetPassword
);

/**
 * @swagger
 * /auth/verify/{method}/{contactInformation}/{code}:
 *   put:
 *     summary: Verify a user’s contact information
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: method
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/AuthMethod'
 *       - in: path
 *         name: contactInformation
 *         required: true
 *         schema:
 *           type: string
 *         description: The email or phone number to verify
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: The verification code sent to the user
 *     responses:
 *       200:
 *         description: Verification successful
 *       400:
 *         description: Invalid code
 */
authRouter.put("/verify/:method/:contactInformation/:code", verify);

/**
 * @swagger
 * /auth/delete/{method}/{contactInformation}/{code}:
 *   delete:
 *     summary: Delete a user account
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: method
 *         required: true
 *         schema:
 *           $ref: '#/components/schemas/AuthMethod'
 *       - in: path
 *         name: contactInformation
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's email or phone number
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: The verification code sent to the user
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       404:
 *         description: User not found
 */
authRouter.delete("/delete/:method/:contactInformation/:code", deleteAccount);

export default authRouter;
