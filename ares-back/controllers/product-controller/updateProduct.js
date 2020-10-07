const fs = require("fs");
const Product = require("../../models/product");
const HttpError = require("../../models/common/http-error");

const { uploadFile, deleteFile } = require("../../helpers/gcs-helper");
const { validationResult } = require("express-validator");

const stackTrace = { controller: "PRODUCT", action: "UPDATE" };

module.exports = updateProduct = async (req, res, next) => {
  const productId = req.params.productId;

  const result = validationResult(req);

  if (!result.isEmpty()) {
    errMessage = result.errors[0].msg;
    return next(new HttpError(errMessage, 400, stackTrace));
  }

  const { name, description, price, category, shipping } = req.body;

  let targetProduct;
  try {
    targetProduct = await Product.findById(productId);

    if (!targetProduct) {
      const error = new HttpError(
        "Product ID does not exists, please choose another instead.",
        422,
        stackTrace
      );

      return next(error);
    }
  } catch (err) {
    const error = new HttpError(
      "Failed to update product, please try again later.",
      500,
      stackTrace
    );

    return next(error);
  }

  if (req.file !== undefined) {
    const filePath = req.file.path;
    const fileName = req.file.filename;
    const folderType = "images";

    let oldUploadUrl = targetProduct.image;
    let newUploadUrl;

    try {
      newUploadUrl = await uploadFile(
        "product",
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
        await deleteFile(targetProduct.image);
      }

      const error = new HttpError(
        "Image upload has failed, Failed to create product, please try again later.",
        500,
        stackTrace
      );

      return next(error);
    }

    //IMAGE IS OPTIONAL, ASSIGN IT AFTER UPLOADING
    targetProduct.image = newUploadUrl;
  }

  targetProduct.name = name;
  targetProduct.description = description;
  targetProduct.price = price;
  targetProduct.category = category;
  targetProduct.shipping = shipping;

  await targetProduct.save();

  res.status(200).json({ product: targetProduct.toObject({ getters: true }) });
};
