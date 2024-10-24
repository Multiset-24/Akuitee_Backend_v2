import {
  Protection as p,
  AdminProtection as ap,
  SuperAdminProtection as sap,
} from "../Middlewares/Protection.middleware.js";
import ApiError from  '../Utils/ApiError.js';
import ApiResponse from '../Utils/ApiResponse.js';
import ImageUploader from "../Utils/ImageUploader.js";
import sendOtpMail from '../Utils/SendOtpMail.js';
import sendMail from '../Utils/SendMessageMail.js';

import express from 'express';
import {createContent, updateContent ,deleteContent} from '../Controllers/CreateAndupdateContent.handler.js';
import {getAllIpos, getAllArtciles, getAllsectors, getAllIndustries, getFilteredContent,getSpecificContent} from '../Controllers/getFilteredContent.handler.js';
const router = express.Router();

router.route('/create').post(p,sap, createContent);
router.route('/update').put(p,sap, updateContent);
router.route('/delete/:id').delete(p,sap, deleteContent);
router.route('/ipos').get(p, getAllIpos);
router.route('/articles').get(p, getAllArtciles);
router.route('/sectors').get(p, getAllsectors);
router.route('/industries').get(p, getAllIndustries);
router.route('/filter').post(p, getFilteredContent);
router.route('/specific/:id').get(p, getSpecificContent);


export default router;