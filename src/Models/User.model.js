import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail from "../Utils/SendMessageMail.js";

const userSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Password: {
      type: String,
      required: true,
    },
    Saved_Articles: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
    },
    Saved_Ipo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ipo",
    },
    Role: {
      type: String,
      enum: ["Admin", "User", "SuperAdmin"],
      default: "User",
    },
    Status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    RefreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  if (this.isModified("Password")) {
    this.Password = bcrypt.hashSync(this.Password, 10);
  }
  next();
});

userSchema.methods.matchPassword = function (enteredPassword) {
  return bcrypt.compareSync(enteredPassword, this.Password);
};

userSchema.methods.getRefreshToken = function () {
  return jwt.sign(
    { id: this._id, Role: this.Role, Email: this.Email, Status: this.status },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE,
    }
  );
};

userSchema.methods.getAccessToken = function () {
  return jwt.sign(
    { id: this._id, Role: this.Role, Email: this.Email, Status: this.status },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE,
    }
  );
};

userSchema.pre("save", async function () {
    if(!this.isNew)return;
    try {
      console.log("Sending email");
      await sendMail(
        this.Email,
        this.Name,
        "Welcome to Akuitee",
        `Hello ${this.Name}, Welcome to Akuitee, your one-stop place for all knowledge related to investments . We are excited to have you on board.`
      );
      console.log("mail sent and now saving refresh token");
      this.RefreshToken = this.getRefreshToken();
      this.RefreshTokenSet = true;
      console.log("Refresh token saved");

    } catch (error) {
      console.error("Error sending email:", error.message);
      throw new Error("Failed to send email");
    }
});

const User = mongoose.model("User", userSchema);

export default User;
