const mongoose = require("mongoose");

const Category = require("../../models/category");
const Product = require("../../models/product");
const HttpError = require("../../models/common/http-error");

const stackTrace = { controller: "CATEGORY", action: "UPDATE" };

module.exports = deleteCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  let existingCategory;

  try {
    existingCategory = await Category.findById(categoryId);

    if (!existingCategory) {
      const error = new HttpError(
        "Category ID does not exists, please choose another instead.",
        422,
        stackTrace
      );

      return next(error);
    }
  } catch (err) {
    const error = new HttpError(
      "Failed to disable category, please try again later.",
      500,
      stackTrace
    );

    return next(error);
  }

  let products;
  try {
    products = await Product.find({ category: categoryId });
  } catch (err) {
    const error = new HttpError(
      "Failed to disable category, please try again later.",
      500,
      stackTrace
    );

    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    existingCategory.isActive = 0;
    await existingCategory.save({ session: sess });

    await Product.updateMany(
      { category: categoryId },
      { isActive: 0 },
      { session: sess }
    );

    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Failed to disable category, please try again later.",
      500,
      stackTrace
    );

    return next(error);
  }

  res.status(200).json({
    success: "Category and the associated products for it has been disabled.",
  });
};
