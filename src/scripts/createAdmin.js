require("dotenv").config({ path: "../../.env" });
const mongoose = require("mongoose");
const User = require("../models/User");
const connectDB = require("../utils/connectDB");
const passwordService = require("../utils/passwordUtils");

const createAdminUser = async () => {
  try {
    console.log("MONGO_URL =", process.env.MONGO_URL);
    await connectDB();

    const adminData = {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASS,
      name: process.env.ADMIN_NAME,

      role: "admin",
      isVerified: true,
    };

    const existedAdmin = await User.findOne({ role: "admin" });

    if (existedAdmin) {
      console.error("Admin is already exist");
      process.exit(1);
    }

    await User.create({
      ...adminData,
      password: await passwordService.hashPassword(adminData.password),
    });

    console.log("Admin is Created Successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin User:", error.message);
    process.exit(1);
  }
};

createAdminUser();
