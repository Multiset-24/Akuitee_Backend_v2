import {
  Protection as p,
  AdminProtection as ap,
  SuperAdminProtection as sap,
} from "../Middlewares/Protection.middleware.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";
import ImageUploader from "../Utils/ImageUploader.js";
import sendOtpMail from "../Utils/SendOtpMail.js";
import sendMail from "../Utils/SendMessageMail.js";

import express from "express";
import {editProfile} from '../Controllers/editProfile.handler.js';
const router = express.Router();

router.route('/edit-profile').put(p,editProfile);



export default router;

