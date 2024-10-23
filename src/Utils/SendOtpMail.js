import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { AsyncHandler } from "./AsyncHandler.js";

// Manually define __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendOtpMail = AsyncHandler(async (email, otp, name) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
  });
  const templatePath = path.join(__dirname, "./otpTemplate.html"); // Ensure the file path is correct
  let htmlTemplate = fs.readFileSync(templatePath, "utf-8");

  htmlTemplate = htmlTemplate
    .replace("{{otp}}", otp)
    .replace("{{Name}}", name);

  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to: email, // Recipient's email
    subject: "Your OTP Code for Account Verification", // Subject line
    html: htmlTemplate, // HTML body content with OTP
  };

  await transporter.sendMail(mailOptions);
  console.log("OTP email sent successfully");
});

export default sendOtpMail;
