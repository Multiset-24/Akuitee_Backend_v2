import {
  Protection as p,
  AdminProtection as ap,
  SuperAdminProtection as sap,
} from "../Middlewares/Protection.middleware.js";
import express from "express";


import { signUpArambh, signUpSampann } from "../Controllers/signUp.handler.js";
import {loginAndsentOtp, verifyLoginOtp} from "../Controllers/login.handler.js";
import {sendResetPasswordOtp, verifyResetPasswordOtp} from "../Controllers/resetPassword.handler.js";
import {logoutUser} from "../Controllers/logout.handler.js";

const router = express.Router();

router.route("/signup").post(signUpArambh);
router.route("/signup/verify").post(signUpSampann);
router.route("/login").post(loginAndsentOtp);
router.route("/login/verify").post(verifyLoginOtp);
router.route("/reset-password").post(sendResetPasswordOtp);
router.route("/reset-password/verify").post(verifyResetPasswordOtp);
router.route("/logout").post(p, logoutUser);

export default router;
