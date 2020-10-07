const fs = require("fs");

const Category = require("../../models/category");
const HttpError = require("../../models/common/http-error");

const { uploadFile, deleteFile } = require("../../helpers/gcs-helper");
const { validationResult } = require("express-validator");

const stackTrace = { controller: "CATEGORY", action: "UPDATE" };

module.exports = updateCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  const result = validationResult(req);

  if (!result.isEmpty()) {
    errMessage = result.errors[0].msg;
    return next(new HttpError(errMessage, 400, stackTrace));
  }

  const { name, description, isActive } = req.body;
  let targetCategory;

  try {
    targetCategory = await Category.findById(categoryId);

    if (!targetCategory) {
      const error = new HttpError(
        "Category ID does not exists, please choose another instead.",
        422,
        stackTrace
      );

      return next(error);
    }
  } catch (err) {
    const error = new HttpError(
      "Failed to update category, please try again later.",
      500,
      stackTrace
    );

    return next(error);
  }

  try {
    let existingCategory = await Category.findOne({ name: name });

    if (existingCategory) {
      const error = new HttpError(
        "Category already exists, please choose another instead.",
        422,
        stackTrace
      );

      return next(error);
    }
  } catch (err) {
    const error = new HttpError(
      "Failed to update category, please try again later.",
      500,
      stackTrace
    );

    return next(error);
  }

  if (req.file !== undefined) {
    const filePath = req.file.path;
    const fileName = req.file.filename;
    const folderType = "images";

    let oldUploadUrl = targetCategory.image;
    let newUploadUrl;

    try {
      newUploadUrl = await uploadFile(
        "category",
        filePath,
        fileName,
        folderType
      );

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
        500,
        stackTrace
      );

      return next(error);
    }

    //IMAGE IS OPTIONAL, ASSIGN IT AFTER UPLOADING
    targetCategory.image = newUploadUrl;
  }

  targetCategory.name = name;

  if (description) {
    targetCategory.description = description;
  }

  if (isActive) {
    targetCategory.isActive = isActive;
  }

  await targetCategory.save();

  res
    .status(200)
    .json({ category: targetCategory.toObject({ getters: true }) });
};
