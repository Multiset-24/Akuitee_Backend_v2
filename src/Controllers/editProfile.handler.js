import User from '../Models/User.model.js';
import ApiError from '../Utils/ApiError.js';
import ApiResponse from '../Utils/ApiResponse.js';
import {AsyncHandler} from '../Utils/AsyncHandler.js';


/**
 * @desc      Edit user profile details
 * @route     PUT /api/v2/profile/edit-profile
 * @access    Private
 */
const editProfile = AsyncHandler(async (req, res) => {
    const { Name, Email, Password } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new ApiError(404, 'User not found'));
    }

    user.Name = Name || user.Name;
    user.Email = Email || user.Email;

    if (Password) {
        user.Password = Password;
    }

    await user.save();

    res.status(200).json(new ApiResponse(200, 'Profile updated successfully'));
});

export {editProfile};