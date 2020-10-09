const fs = require("fs");
const Category = require("../../models/category");
const HttpError = require("../../models/common/http-error");

const { uploadFile, deleteFile } = require("../../helpers/gcs-helper");
const { validationResult } = require("express-validator");

const stackTrace = { controller: "CATEGORY", action: "CREATE" };

module.exports = createCategory = async (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    errMessage = result.errors[0].msg;
    return next(new HttpError(errMessage, 400, stackTrace));
  }

  if (req.file === undefined) {
    errMessage = "Image must not be empty.";
    return next(new HttpError(errMessage, 400, stackTrace));
  }

  const { name, description } = req.body;

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
      "Failed to create category, please try again later.",
      500,
      stackTrace
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
      500,
      stackTrace
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
      500,
      stackTrace
    );

    return next(error);
  }

  res.status(201).json(createdCategory);
};
