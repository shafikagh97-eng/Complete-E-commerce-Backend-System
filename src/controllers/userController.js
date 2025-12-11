const User = require("../models/User");
const Address = require("../models/Address");
class UserController {
  async getUserProfile(req, res) {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  }
  async updateUserProfile(req, res) {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.avatar = req.body.avatar || user.avatar;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      updatedUser,
    });
  }
  async updateShippingAdress(req, res) {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { addressId, street, city, state, zipCode, country, isDefault } =
      req.body;

    let address;

    if (addressId) {
      //update address
      address = await Address.findById(addressId);

      if (!address) {
        return res
          .status(404)
          .json({ success: false, message: "Address not found" });
      }

      if (!user.adresses.includes(address._id)) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to edit this address",
        });
      }

      address.street = street || address.street;
      address.city = city || address.city;
      address.state = state || address.state;
      address.zipCode = zipCode || address.zipCode;
      address.country = country || address.country;
      address.isDefault =
        isDefault !== undefined ? isDefault : address.isDefault;

      await address.save();
    } else {
      //add new address
      address = await Address.create({
        street,
        city,
        state,
        zipCode,
        country,
        isDefault: isDefault || false,
      });

      user.adresses.push(address._id);
      await user.save();
    }

    if (address.isDefault) {
      await Address.updateMany(
        { _id: { $ne: address._id }, _id: { $in: user.adresses } },
        { $set: { isDefault: false } }
      );
    }

    res.status(200).json({
      success: true,
      message: addressId
        ? "Address updated successfully"
        : "Address added successfully",
      address,
    });
  }
}
module.exports = new UserController();
