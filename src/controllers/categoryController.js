const Category = require("../models/Category");
class CategoryController {
  async add(req, res) {
    const { name, description, image, parentCategory } = req.body;

    const category = await Category.create({
      name,
      description,
      image,
      parentCategory: parentCategory || null,
    });

    res.status(201).json({ success: true, category });
  }
}
module.exports = new CategoryController();
