const passwordService = require("../utils/passwordUtils");
const User = require("../models/User");
const Token = require("../models/Token");
const tokenService = require("../utils/generateToken");
const cookieService = require("../utils/cookiesUtils");
const sendMessage = require("../utils/sendEmail");
const { generateResetToken } = require("../utils/generateResetToken");

class AuthController {
  async handledFailedLogin(user) {
    // add +1
    user.failedLoginAttempts = user.failedLoginAttempts + 1;

    // check from limit
    if (user.failedLoginAttempts >= 5) {
      user.isLocked = true;
      const MIN = 30 * 60 * 1000;
      // locked -> locked until (30m)
      user.lockedUntil = new Date(Date.now() + MIN);
    }

    // save updates
    await user.save();
  }

  async resetFailedLoginAttemtps(user) {
    user.failedLoginAttempts = 0;
    user.isLocked = false;
    user.lockedUntil = null;
    await user.save();
  }
  async register(req, res) {
    const { name, email, password, addresses, avatar, phone } = req.body;
    console.log("req.body:", req.body);

    const existEmail = await User.findOne({ email });

    if (existEmail) {
      return res.status(400).json({ message: "Your Email Already Exist" });
    }

    // Check From Strength Password

    const hashed = await passwordService.hashPassword(password);

    const user = await User.create({
      email,
      name,
      password: hashed,
      addresses,
      avatar,
      phone,
    });
    //generate token for verify
    const token = await generateResetToken(user._id, "verifyEmail");
    //send email or url
    await sendMessage({
      from: "e-commerceapp@example.com",
      to: user.email,
      subject: "verify Email",
      text: `This is the <a href=''>http://localhost:3000/api/v1/auth/verify-email/${token}</a>`,
    });
    const verifyLink = `http://localhost:3000/api/auth/verify-email/${token}`;
    console.log(`http://localhost:3000/api/auth/verify-email/${token}`);
    return res.status(201).json({
      success: true,
      message: "User registered. Please check your email.",
      verifyLink,
    });
  }
  login = async (req, res) => {
    const { email, password } = req.body;

    const existEmail = await User.findOne({ email });

    if (!existEmail) {
      return res.status(404).json({ message: "Failed Login" });
    }

    // Password Verifing
    const verifed = await passwordService.verifyPassword(
      password,
      existEmail.password
    );

    if (!verifed) {
      // handle failed login attempts (5)
      await this.handledFailedLogin(existEmail);
      return res.status(404).json({ message: "Failed Login" });
    }

    // reset after one success login
    await this.resetFailedLoginAttemtps(existEmail);

    // Generate tokens
    const accessToken = tokenService.genrateAccessToken({
      id: existEmail._id,
      email: existEmail.email,
      role: existEmail.role,
    });

    const refreshToken = tokenService.genrateRefreshToken({
      id: existEmail._id,
      email: existEmail.email,
      role: existEmail.role,
    });

    // Save on cookies
    cookieService.setAccessToken(res, accessToken);
    cookieService.setRefreshToken(res, refreshToken);

    //await sendMessage({ form: , to:  })

    return res.status(200).json({ message: "Logged in Successfully" });
  };
  async logout(req, res) {
    cookieService.clearTokens(res);

    return res.status(200).json({ message: "Logged Out Successfuly" });
  }
  async refreshToken(req, res) {
    const refreshToken = cookieService.getRefreshToken(req);

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh Token Required" });
    }

    // verify to refresh token (age, valid)
    const decoded = tokenService.verifyRefreshToken(refreshToken);

    const tokenPayload = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    // generate tokens (access, refresh)
    const accessToken = tokenService.genrateAccessToken(tokenPayload);
    const newRefreshToken = tokenService.genrateRefreshToken(tokenPayload);

    // store cookies
    cookieService.setAccessToken(res, accessToken);
    cookieService.setRefreshToken(res, newRefreshToken);

    return res.status(200).json({
      message: "Tokens Refreshed Successfully",
    });
  }
  async verifyEmail(req, res) {
    // knowing the user who ask to verify email
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { isVerified: true },
      { new: true }
    );

    console.log(updatedUser.isVerified);
    res.status(200).json({ success: true, message: "Verifing Successfully" });
  }

  async forgotPassword(req, res) {
    const userId = req.user.id;
    const email = req.user.email;

    const token = await generateResetToken(userId, "resetPassword");
    await sendMessage({
      from: "e-commerceapp@example.com",
      to: email,
      subject: "Update Password",
      text: `This is the <a href=''>http://localhost:3000/api/v1/auth/reset-password/${token}</a>`,
    });
    console.log(`http://localhost:3000/api/v1/auth/reset-password/${token}`);

    res.status(200).json({ success: true, message: "Sent email successfully" });
  }
  async resetPassword(req, res) {
    // knowing the user who ask to update the password
    await User.findByIdAndUpdate(req.user.id, { isVerifiedToUpdate: true });

    res.status(200).json({ success: true, message: "Verifing Successfully" });
  }
  async updatePassword(req, res) {
    const { password } = req.body;
    const id = req.user.id;

    const isExist = await User.findByIdAndUpdate(
      req.user.id,
      {
        isVerifiedToUpdate: true,
      },
      { new: true }
    );

    console.log(isExist);

    if (!isExist) {
      throw new Error("You Can Not Make this Action");
    }

    await User.findByIdAndUpdate(id, {
      password: await passwordService.hashPassword(password),
      isVerifiedToUpdate: false,
    });

    res
      .status(200)
      .json({ success: true, message: "Updated Password Successfully" });
  }
}
module.exports = new AuthController();
