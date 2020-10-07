const Category = require("../../models/category");
const HttpError = require("../../models/common/http-error");

const controller = "CATEGORY";

const getCategories = async (req, res, next) => {
  const stackTrace = { controller, action: "GET" };

  let categories;
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const isActive = req.query.isActive ? req.query.isActive : true;

    categories = await Category.find({ isActive })
      .limit(limit)
      .skip((page - 1) * limit);
  } catch (err) {
    const error = new HttpError(
      "Failed to fetch categories, please try again later.",
      500,
      stackTrace
    );

    return next(error);
  }
  res.json(categories);
};

const getCategoryById = async (req, res, next) => {
  const stackTrace = { controller, action: "GET_BY_ID" };

  const categoryId = req.params.categoryId;
  let category;

  try {
    category = await Category.findById(categoryId);
  } catch (err) {
    const error = new HttpError(
      "Failed to fetch category, please try again later.",
      500,
      stackTrace
    );

    return next(error);
  }
  res.json(category);
};

exports.getCategories = getCategories;
exports.getCategoryById = getCategoryById;
