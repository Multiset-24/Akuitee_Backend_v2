import User from "../Models/User.model.js";
import sendMail from "../Utils/SendMessageMail.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendOtpMail from "../Utils/SendOtpMail.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import Content from "../Models/Content.model.js";
import StagedContent from "../Models/StagedContent.model.js";
/**
 * @desc      Update existing content for admin
 * @route     PUT /api/v2/admin/update-content/:id
 * @access    Private (Admin only)
 */
const updateExistingContentForadmin = AsyncHandler(async (req, res) => {
    const { id } = req.params;

    const stagedContent = await StagedContent.findById(id);
    if (!stagedContent) {
        throw new ApiError(404, "Staged content not found");
    }

});