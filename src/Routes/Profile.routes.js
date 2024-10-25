import {
  Protection as p,
  AdminProtection as ap,
  SuperAdminProtection as sap,
} from "../Middlewares/Protection.middleware.js";

import express from "express";
import {editProfile} from '../Controllers/editProfile.handler.js';
import {getAllUsers, getAllAdmins, createAdmin, removeAdmin, deleteUser} from '../Controllers/adminCreationRemovalandGetAdminsandUsers.handler.js';
import {notesCreation, notesList, notesUpdate, notesDelete} from '../Controllers/notes.handler.js';
import {addToWatchlist, removeFromWatchlist, getWatchlist} from '../Controllers/watchlist.handler.js';
const router = express.Router();

router.route('/edit-profile').put(p,editProfile);
router.route('/notes').post(p,notesCreation).get(p,notesList);
router.route('/notes/:id').put(p,notesUpdate).delete(p,notesDelete);
router.route('/users').get(p,sap,getAllUsers);
router.route('/admins').get(p,sap,getAllAdmins);
router.route('/admins/:id').post(p,sap,createAdmin).put(p,sap,removeAdmin);
router.route('/users/:id').delete(p,sap,deleteUser);
router.route('/watchlist/add/:id').post(p,addToWatchlist);
router.route('/watchlist/remove/:id').delete(p,removeFromWatchlist);
router.route('/watchlist').get(p,getWatchlist);




export default router;

