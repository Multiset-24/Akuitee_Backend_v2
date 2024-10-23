import ApiResponse from "../Utils/ApiResponse.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import  User  from "../Models/User.model.js";

/**
 * @desc      Logout user and clear tokens
 * @route     POST /api/v2/user/logout
 * @access    Private
 * @note      This controller is responsible for logging out the user
 *            It clears the access token and refresh token from the cookies
 *            It also clears the tokens stored in the user's document
 */
const logoutUser = AsyncHandler(async (req, res) => {
   
    // Clear tokens from the user document
    const user = await User.findById(req.user.id);
    user.RefreshToken = " ";
    await user.save();

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    // Send response
    res.json(new ApiResponse(200, "User logged out successfully"));
});

export { logoutUser };