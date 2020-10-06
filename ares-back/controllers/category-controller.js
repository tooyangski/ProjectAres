const Category = require("../models/category");
const HttpError = require("../models/common/http-error");
const { uploadToAWS, retrieveFile } = require("../middlewares/aws-extension");

const { validationResult } = require("express-validator");

const getAllCategories = async (req, res, next) => {
  let categories;
  try {
    categories = await Category.find();
  } catch (err) {
    const error = new HttpError(
      "Failed to fetch categories, please try again later.",
      500
    );
    return next(error);
  }
  res.json(categories);
};

const getCategoryById = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  let category;

  try {
    category = await Category.findById(categoryId);
  } catch (err) {
    const error = new HttpError(
      "Failed to fetch category, please try again later.",
      500
    );
    return next(error);
  }
  res.json(category);
};

const createCategory = async (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    errMessage = result.errors[0].msg;
    return next(new HttpError(errMessage, 400));
  }

  const { name, description } = req.body;

  try {
    let existingCategory = await Category.findOne({ name: name });

    if (existingCategory) {
      const error = new HttpError(
        "Category already exists, please choose another instead.",
        422
      );
      return next(error);
    }
  } catch (err) {
    const error = new HttpError(
      "Failed to create category, please try again later.",
      500
    );
    return next(error);
  }

  const createdCategory = new Category({
    name,
    description,
  });

  try {
    await createdCategory.save();
  } catch (err) {
    const error = new HttpError(
      "Failed to create category, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json(createdCategory);
};

const updateCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  const result = validationResult(req);

  if (!result.isEmpty()) {
    errMessage = result.errors[0].msg;
    return next(new HttpError(errMessage, 400));
  }
  const { name, description } = req.body;

  let targetCategory;

  try {
    targetCategory = await Category.findById(categoryId);
  } catch (err) {
    const error = new HttpError(
      "Failed to update category, please try again later.",
      500
    );
    return next(error);
  }

  try {
    let existingCategory = await Category.findOne({ name: name });

    if (existingCategory) {
      const error = new HttpError(
        "Category already exists, please choose another instead.",
        422
      );
      return next(error);
    } else {
      targetCategory.name = name;
      targetCategory.description = description;
      await targetCategory.save();
    }
  } catch (err) {
    const error = new HttpError(
      "Failed to update category, please try again later.",
      500
    );
    return next(error);
  }

  res
    .status(200)
    .json({ category: targetCategory.toObject({ getters: true }) });
};

const deleteCategory = async (req, res, next) => {};

exports.getAllCategories = getAllCategories;
exports.getCategoryById = getCategoryById;
exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
