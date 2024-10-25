import User from '../Models/User.model.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendOtpMail from '../Utils/SendOtpMail.js';
import ApiError from '../Utils/ApiError.js';
import ApiResponse from '../Utils/ApiResponse.js';
import { AsyncHandler } from '../Utils/AsyncHandler.js';
import StagedContent from '../Models/StagedContent.model.js';

/**
 * @desc      Get specific staged content
 * @route     GET /api/v2/staged-content/:id
 * @access    Private (SuperAdmin only)
 */
const getSpecificStagedContent = AsyncHandler(async (req, res) => {
    const { id } = req.params;

    const stagedContent = await StagedContent.findById({_id:id}).populate('Author', 'Name');
    if (!stagedContent) {
        throw new ApiError(404, "Staged content not found");
    }

    res.status(200).json(new ApiResponse(200, "Staged content fetched successfully", stagedContent));
});

/**
 * @desc      Get all staged content
 * @route     GET /api/v2/staged-content
 * @access    Private (SuperAdmin only)
 */
const getAllStagedContent = AsyncHandler(async (req, res) => {
    const stagedContent = await StagedContent.find().populate('Author', 'Name').sort({ Created_At: -1 });
    res.status(200).json(new ApiResponse(200, "All staged content fetched successfully", stagedContent));
});

/**
 * @desc      Get all staged content for a specific admin
 * @route     GET /api/v2/staged-content/admin
 * @access    Private (Admin only)
 */

const getAdminSpecificStagedContent = AsyncHandler(async (req, res) => {
    const stagedContent = await StagedContent.find({ Author: req.user._id }).populate('Author', 'Name').sort({ Created_At: -1 });
    res.status(200).json(new ApiResponse(200, "All staged content fetched successfully", stagedContent));
});

export { getSpecificStagedContent, getAllStagedContent, getAdminSpecificStagedContent };