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
import {notesCreation, notesList, notesUpdate, notesDelete} from '../Controllers/notes.handler.js';
const router = express.Router();

router.route('/edit-profile').put(p,editProfile);
router.route('/notes').post(p,notesCreation).get(p,notesList);
router.route('/notes/:id').put(p,notesUpdate).delete(p,notesDelete);



export default router;

