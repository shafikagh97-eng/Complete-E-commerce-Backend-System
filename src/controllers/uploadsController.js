const uploadToCloudinary = require("../utils/cloudinary");

class UploadsController {
  uploadLocalByMulter = async (req, res) => {
    if (!req.file) {
      throw new Error("No File Uploaded");
    }

    const path = `${req.protocol}://${req.get("host")}/${req.file.path.replace(
      "uploads/",
      ""
    )}`;

    res.status(200).json({ success: true, path });
  };

  uploadCloudByCloudinary = async (req, res) => {
    if (!req.file) throw new Error("No file uploaded");

    const url = await uploadToCloudinary(req.file);
    return url;
  };
}

module.exports = new UploadsController();
