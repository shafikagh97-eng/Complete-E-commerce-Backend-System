const Token = require("../models/Token");

const verifyTokenMiddleware = (type) => {
  return async (req, res, next) => {
    try {
      const { token } = req.params;

      if (!token) {
        return res
          .status(400)
          .json({ success: false, message: "Token is required" });
      }

      const tokenDoc = await Token.findOne({ token, type });
      req.userId = tokenDoc.user;
      if (!tokenDoc) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid token" });
      }

      if (tokenDoc.expiresAt < new Date()) {
        return res
          .status(400)
          .json({ success: false, message: "Token expired" });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
module.exports = verifyTokenMiddleware;
