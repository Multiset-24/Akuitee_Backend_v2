import {
  Protection as p,
  AdminProtection as ap,
  SuperAdminProtection as sap,
} from "../Middlewares/Protection.middleware.js";


import express from 'express';
import {createContent, updateContent ,deleteContent} from '../Controllers/createAndupdateContentSuperAdmin.handler.js';
import {getAllIpos, getAllArtciles, getAllsectors, getAllIndustries, getFilteredContent,getSpecificContent} from '../Controllers/getFilteredContent.handler.js';
import {approveStagedContent} from '../Controllers/stagedContentApproval.handler.js';
import {createStagedContent, updateStagedContent, deleteStagedContent} from '../Controllers/createAndupdateStagedContentAdmin.handler.js'
import {getSpecificStagedContent, getAllStagedContent, getAdminSpecificStagedContent} from '../Controllers/getStagedContent.handler.js';
import {updateExistingContentForadmin} from '../Controllers/updateExistingContentForadmin.handler.js';
const router = express.Router();

router.route('/create').post(p,sap, createContent);
router.route('/update').put(p,sap, updateContent);
router.route('/delete/:id').delete(p,sap, deleteContent);
router.route('/ipos').get(p, getAllIpos);
router.route('/articles').get(p, getAllArtciles);
router.route('/sectors').get(p, getAllsectors);
router.route('/industries').get(p, getAllIndustries);
router.route('/filter').get(p, getFilteredContent);
router.route('/specific/:id').get(p, getSpecificContent);
router.route('/staged-content/create').post(p,ap, createStagedContent);
router.route('/staged-content/update/:id').put(p,ap, updateStagedContent);
router.route('/staged-content/delete/:id').delete(p,ap, deleteStagedContent);
router.route('/staged-content/approve/:id').post(p,sap, approveStagedContent);
router.route('/staged-content/:id').get(p,sap, getSpecificStagedContent);
router.route('/staged-content').get(p,sap, getAllStagedContent);
router.route('/staged-content/admin').get(p,ap,getAdminSpecificStagedContent);
router.route('/admin/update-content/:id').put(p,ap, updateExistingContentForadmin);
// router.route('/existing-content/approve/:id').post(p,sap, existingContentApproval);



export default router;