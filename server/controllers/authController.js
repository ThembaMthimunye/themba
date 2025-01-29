import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";
import nodemailer from "nodemailer";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "missing details" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 14 * 60 * 60 * 1000,
    });

    // Function to send a welcome email

    const mailOptions = {
      from: "cassiusmaropene@gmail.com",
      to: email,
      subject: "Welcome to our world!",
      text: `We’re so excited to have you on board! You’ve just taken the first step toward an exciting learning experience. Whether you're here to have fun, explore new ideas, or dive deep into something new, we’re here to make your journey amazing.

If you need any help or have any questions, don’t hesitate to reach out. We’re always here to assist you!

Get ready for an exciting adventure, and let’s get started! 🚀

Welcome aboard!

The iThemba Team

`,
    };

    await transporter.sendMail(mailOptions);

    //////////=================================///////////////////////////
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and passwaord required",
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 14 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "User is succesfully logged in",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Succesfuly Logged Out" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    if (user.isAccountVerified) {
      res.json({ success: false, message: "account is already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.sendVerifyOtpExpiryAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: "cassiusmaropene@gmail.com",
      to: user.email,
      subject: "OTP For Your Account",
      text: `Please use the given ${otp} to verify your account`,
    };
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Otp sent via email" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;
  if (!userId || !otp) {
    return res.json({ success: false, message: "Missing details" });
  }
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid otp" });
    }

    if (user.sendVerifyOtpExpiryAt < Date.now()) {
      return res.json({ success: false, message: "Otp expired" });
    }
    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.sendVerifyOtpExpiryAt = 0;
    await user.save();
    return res.json({ success: true, message: "Email verified successfuly" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true, message: "User is authenticated" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const sendResertOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: "email is required" });
  }

  try {
    const user = await userModel.findOneAndDelete({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: "cassiusmaropene@gmail.com",
      to: user.email,
      subject: "Reset OTP ",
      text: `Please use the given ${otp} to TO reset`,
    };
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "reset Otp sent via email" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({
      success: false,
      message: "email otp and new password are required ",
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }

    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({ success: false, message: "invalid otp" });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "Otp expired" });
    }

    const hashedPassword=await bcrypt.hash(newPassword,10);
    user.password=hashedPassword;
    user.resetOtp='';
    user.resetOtpExpireAt=0;
    user.save();
    res.json({ success: true, message: "Password reset succesfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
