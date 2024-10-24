import User from '../Models/User.model.js';
import ApiError from '../Utils/ApiError.js';
import ApiResponse from '../Utils/ApiResponse.js';
import { AsyncHandler } from '../Utils/AsyncHandler.js';

/**
 * @desc      Get all users except master admin
 * @route     GET /api/v2/profile/users
 * @access    Private
 */
const getAllUsers = AsyncHandler(async (req, res) => {
    const users = await User.find({ Role: 'User' }).select('-Password');
    res.status(200).json(new ApiResponse(200, users));
});

/**
 * @desc      Get all admins
 * @route     GET /api/v2/profile/admins
 * @access    Private
 */
const getAllAdmins = AsyncHandler(async (req, res) => {
    const admins = await User.find({ Role: 'Admin' }).select('-Password');
    res.status(200).json(new ApiResponse(200, admins));
});

/**
 * @desc      Create a new admin
 * @route     POST /api/v2/profile/admins/:id
 * @access    Private
 */
const createAdmin = AsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ApiError(400, 'User not found'));
    }
    if (user.Role === 'Admin') {
        return res.status(400).json(new ApiResponse(400, 'User is already an admin'));
    }
    user.Role = 'Admin';
    await user.save();
    res.status(200).json(new ApiResponse(200, 'Admin created successfully'));
});

/**
 * @desc      Remove admin privileges
 * @route     PUT /api/v2/profile/admins/:id
 * @access    Private
 */
const removeAdmin = AsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ApiError(400, 'User not found'));
    }
    if (user.Role === 'User') {
        return res.status(400).json(new ApiResponse(400, 'User is already a user'));
    }
    user.Role = 'User';
    await user.save();
    res.status(200).json(new ApiResponse(200, 'Admin removed successfully'));
});

/**
 * @desc      Delete a user
 * @route     DELETE /api/v2/profile/users/:id
 * @access    Private
 */
const deleteUser = AsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ApiError(400, 'User not found'));
    }
    await user.deleteOne();
    res.status(200).json(new ApiResponse(200, 'User deleted successfully'));
});

export { getAllUsers, getAllAdmins, createAdmin, removeAdmin, deleteUser };