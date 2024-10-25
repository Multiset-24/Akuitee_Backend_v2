import User from "../Models/User.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendOtpMail from "../Utils/SendOtpMail.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";

/**
 * @desc      Login user and send OTP
 * @route     POST /api/v2/user/login
 * @access    Public
 * @note      This controller is responsible for sending the OTP to the user
 *            after verifying the user's credentials
 *            The OTP is sent to the user's email
 *            The OTP is generated using the crypto module
 *            The OTP is sent to the user's email using the sendOtpMail utility
 *            The OTP is sent in an email template
 *            The OTP is sent in an email template that is rendered using the ejs templating engine
 **/
const loginAndsentOtp = AsyncHandler(async (req, res) => {
  const { Email, Password } = req.body;

  const user = await User.findOne({ Email: Email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.Status === "Inactive") {
    throw new ApiError(401, "User is Inactive");
  }

  if (!user.matchPassword(Password)) {
    throw new ApiError(401, "Invalid Password");
  }

  const otp = crypto.randomInt(100000, 999999).toString();

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
 * @desc      Verify login OTP
 * @route     POST /api/v2/user/login/verify
 * @access    Public
 * @note      This controller is responsible for verifying the OTP entered by the user
 *            The OTP is verified by decoding the OTP token and comparing the OTP
 *            in the token with the OTP entered by the user
 *            If the OTP is correct, the user is logged in
 *            The user is logged in by creating an access token and a refresh token
 *            The access token is sent in a cookie
 *            The refresh token is saved in the user document in the database
 *            The refresh token is sent in a cookie
 *            The OTP token is cleared from the cookies
 *            The access token is sent in the response
 *            The access token is used to authenticate the user in the subsequent requests
 * */
const verifyLoginOtp = AsyncHandler(async (req, res) => {
  const { Email, otp, Password } = req.body;
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
  if (!user.matchPassword(Password)) {
    throw new ApiError(401, "Invalid Password");
  }

  const accessToken = user.getAccessToken();
  const refreshToken = user.getRefreshToken();
  user.RefreshToken = refreshToken;
  await user.save();
  user.Password = "";
  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    })
    .header("x-auth-token", accessToken)
    .clearCookie("otpToken")
    .json(new ApiResponse(200, "Login successful", { accessToken,user }));
});

export { loginAndsentOtp, verifyLoginOtp };
