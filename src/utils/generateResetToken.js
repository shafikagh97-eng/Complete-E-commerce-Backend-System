const Token = require("../models/Token");
const crypto = require("crypto");

exports.generateResetToken = async (userId, type) => {
  if (!userId) {
    throw new Error("User ID is required to generate token");
  }

  const token = crypto.randomBytes(32).toString("hex");

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await Token.create({
    user: userId,
    token,
    type,
    expiresAt,
  });

  return token;
};
