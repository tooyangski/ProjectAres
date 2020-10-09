const fs = require("fs");
const Product = require("../../models/product");
const HttpError = require("../../models/common/http-error");

const { uploadFile, deleteFile } = require("../../helpers/gcs-helper");
const { validationResult } = require("express-validator");

const stackTrace = { controller: "PRODUCT", action: "CREATE" };

module.exports = createProduct = async (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    errMessage = result.errors[0].msg;
    return next(new HttpError(errMessage, 400, stackTrace));
  }

  if (req.file === undefined) {
    errMessage = "Image must not be empty.";
    return next(new HttpError(errMessage, 400, stackTrace));
  }

  const { name, description, price, category, shipping, stock } = req.body;

  try {
    let existingProduct = await Product.findOne({ name: name });

    if (existingProduct) {
      const error = new HttpError(
        "Product already exists, please choose another instead.",
        422,
        stackTrace
      );

      return next(error);
    }
  } catch (err) {
    const error = new HttpError(
      "Failed to create Product, please try again later.",
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
    uploadUrl = await uploadFile("product", filePath, fileName, folderType);

    //DELETE THE IMAGE LOCALLY AFTER UPLOADING
    fs.unlink(filePath, (err) => {
      console.log(err);
    });
  } catch (err) {
    const error = new HttpError(
      "Image upload has failed, Failed to create product, please try again later.",
      500,
      stackTrace
    );

    return next(error);
  }

  const createdProduct = new Product({
    name,
    description,
    price,
    category,
    image: uploadUrl,
    stock,
    isActive: 1,
    shipping,
  });

  try {
    await createdProduct.save();
  } catch (err) {
    //DELETE THE UPLOADED IMAGE IF PRODUCT WAS NOT SAVED.
    await deleteFile(createdProduct.image);

    const error = new HttpError(
      "Failed to create product, please try again later.",
      500,
      stackTrace
    );

    return next(error);
  }

  res.status(201).json(createdProduct);
};
