const uploadToCloudinary = require("../utils/cloudinary");

const uploadCloud = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      req.cloudImages = [];
      return next();
    }

    const urls = [];

    for (let file of req.files) {
      const url = await uploadToCloudinary(file);
      urls.push(url);
    }

    req.cloudImages = urls;

    next();
  } catch (err) {
    next(err);
  }
};
module.exports = uploadCloud;
