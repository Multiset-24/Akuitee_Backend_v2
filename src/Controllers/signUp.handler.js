import User from "../Models/User.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendOtpMail from "../Utils/SendOtpMail.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";

/**
 * @desc      Sign up user and send OTP
 * @route     POST /api/v2/user/sign-up
 * @access    Public
 */
const signUpArambh = AsyncHandler(async (req, res) => {
  const { Name, Email, Password } = req.body;

  if (!Name || !Email || !Password) {
    throw new ApiError(400, "Please provide all the details");
  }

  const user = await User.findOne({ Email });

  if (user) {
    throw new ApiError(400, "User already exists");
  }

  const otp = crypto.randomInt(100000, 999999).toString();

  // Since password will be hashed before saving to db, no need to hash it here
  const otpToken = jwt.sign({ Email, otp }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });
  const message = "Thank you for signing up with us. Your OTP is";
  try {
    await sendOtpMail(Email, otp, Name);
    res.cookie("otpToken", otpToken, {
      httpOnly: true,
      maxAge: 600000, // 10 minutes
    });
    res.json(new ApiResponse(200, "OTP sent successfully"));
  } catch (err) {
    throw new ApiError(500, "Email could not be sent");
  }
});

/**
 * @desc      Sign up user
 * @route     POST /api/v2/user/sign-up/verify
 * @access    Public
 * @note      This controller is responsible for creating the user in the database
 *            after verifying the OTP
 *            The OTP is verified by decoding the OTP token and comparing the OTP
 *            in the token with the OTP entered by the user
 *            If the OTP is correct, the user is created in the database
 */
const signUpSampann = AsyncHandler(async (req, res) => {
  const { Name, Email, Password, otp } = req.body;
  const otpToken = req.cookies.otpToken;

  if (!Name || !Email || !Password || !otp) {
    throw new ApiError(400, "Please provide all the details");
  }

  const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);

  if (
    decoded.otp !== otp ||
    decoded.Email !== Email ||
    Date.now() > decoded.exp * 1000
  ) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  const user = await User.create({ Name, Email, Password });

  await user.save();

  const accessToken = user.getAccessToken();

  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
    })
    .json(new ApiResponse(200, "User created successfully"));
});

export { signUpArambh, signUpSampann };
