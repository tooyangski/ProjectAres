const fs = require("fs");
const Category = require("../models/category");
const HttpError = require("../models/common/http-error");

const { uploadFile, deleteFile } = require("../helpers/gcs-helper");
const { validationResult } = require("express-validator");

const createCategory = async (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    errMessage = result.errors[0].msg;
    return next(new HttpError(errMessage, 400));
  }

  if (req.file === undefined) {
    errMessage = "Image must not be empty.";
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

  const filePath = req.file.path;
  const fileName = req.file.filename;
  const folderType = "images";

  let uploadUrl;

  try {
    uploadUrl = await uploadFile("category", filePath, fileName, folderType);

    //DELETE THE IMAGE LOCALLY AFTER UPLOADING
    fs.unlink(filePath, (err) => {
      console.log(err);
    });
  } catch (err) {
    const error = new HttpError(
      "Image upload has failed, Failed to create category, please try again later.",
      500
    );
    return next(error);
  }

  const createdCategory = new Category({
    name,
    description,
    image: uploadUrl,
    isActive: 1,
  });

  try {
    await createdCategory.save();
  } catch (err) {
    //DELETE THE UPLOADED IMAGE IF CATEGORY WAS NOT SAVED.
    await deleteFile(createdCategory.image);

    const error = new HttpError(
      "Failed to create category, please try again later.",
      500
    );
    return next(error);
  }

  res.status(201).json(createdCategory);
};

const getAllCategories = async (req, res, next) => {
  let categories;
  try {
    const limit = parseInt(req.query.limit);
    const page = parseInt(req.query.page);

    if (!limit && !page) {
      categories = await Category.find();
    } else {
      categories = await Category.find()
        .limit(limit)
        .skip((page - 1) * limit);
    }
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

const updateCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  console.log("categoryId: ", categoryId);

  const result = validationResult(req);

  if (!result.isEmpty()) {
    errMessage = result.errors[0].msg;
    return next(new HttpError(errMessage, 400));
  }

  if (req.file === undefined) {
    errMessage = "Image must not be empty.";
    return next(new HttpError(errMessage, 400));
  }

  const { name, description } = req.body;

  try {
    let targetCategory = await Category.findById(categoryId);

    if (targetCategory) {
      const error = new HttpError(
        "Category ID does not exists, please choose another instead.",
        422
      );
      return next(error);
    }
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
    }
  } catch (err) {
    const error = new HttpError(
      "Failed to update category, please try again later.",
      500
    );
    return next(error);
  }

  const filePath = req.file.path;
  const fileName = req.file.filename;
  const folderType = "images";

  let oldUploadUrl = targetCategory.image;
  let newUploadUrl;

  try {
    newUploadUrl = await uploadFile("category", filePath, fileName, folderType);

    //DELETE THE OLD IMAGE FROM CLOUD AFTER SUCCESSFULLY UPLOADED THE NEW ONE
    if (newUploadUrl) {
      await deleteFile(oldUploadUrl);
    }

    //DELETE THE IMAGE LOCALLY AFTER UPLOADING
    fs.unlink(filePath, (err) => {
      console.log(err);
    });
  } catch (err) {
    //IF THE DELETION OF THE OLD IMAGE FAIL, IT WILL DELETE THE NEW
    //IMAGE AND CANCEL THE SAVING BY THROWING AN ERROR
    if (newUploadUrl) {
      await deleteFile(targetCategory.image);
    }

    const error = new HttpError(
      "Image upload has failed, Failed to create category, please try again later.",
      500
    );
    return next(error);
  }

  targetCategory.name = name;
  targetCategory.description = description;
  targetCategory.image = newUploadUrl;
  await targetCategory.save();

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
