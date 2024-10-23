import User from "../Models/User.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendOtpMail from "../Utils/SendOtpMail.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import sendMail from "../Utils/SendMessageMail.js";

/**
 * @desc      Verify email and send OTP for password reset
 * @route     POST /api/v2/user/reset-password
 * @access    Public
 * @note      This controller is responsible for sending the OTP to the user's email
 *            after verifying the user's email
 *            The OTP is generated using the crypto module
 *            The OTP is sent to the user's email using the sendOtpMail utility
 */
const sendResetPasswordOtp = AsyncHandler(async (req, res) => {
  const { Email } = req.body;

  const user = await User.findOne({ Email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.Status === "Inactive") {
    throw new ApiError(401, "User is Inactive");
  }

  const otp = crypto.randomInt(1000, 9999).toString();

  const otpToken = jwt.sign({ Email, otp }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });

  try {
    await sendOtpMail(Email, otp, user.Name);
  } catch (error) {
    throw new ApiError(500, "Failed to send OTP");
  }

  res
    .cookie("otpToken", otpToken, {
      httpOnly: true,
      maxAge: 600000, // 10 minutes
    })
    .json(new ApiResponse(200, "OTP sent successfully"));
});


/**
 * @desc      Verify OTP and reset password
 * @route     POST /api/v2/user/reset-password/verify
 * @access    Public
 * @note      This controller is responsible for verifying the OTP entered by the user
 *            and resetting the user's password
 *            The OTP is verified by decoding the OTP token and comparing the OTP
 *            in the token with the OTP entered by the user
 *            If the OTP is correct, the user's password is updated
 *            The OTP token is cleared from the cookies
 */
const verifyResetPasswordOtp = AsyncHandler(async (req, res) => {
  const { Email, otp, NewPassword } = req.body;
  const otpToken = req.cookies.otpToken;

  if (!otpToken) {
    throw new ApiError(401, "OTP Token not found");
  }

  const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);

  if (decoded.otp !== otp || decoded.Email !== Email) {
    throw new ApiError(401, "Invalid OTP");
  }

  const user = await User.findOne({ Email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.Password = NewPassword;
  await user.save();

  await sendMail(
    Email,
    user.Name,
    "Password Reset Successful",
    "Your password has been reset successfully"
    );
  res
    .clearCookie("otpToken")
    .json(new ApiResponse(200, "Password reset successful"));
});

export { sendResetPasswordOtp, verifyResetPasswordOtp };