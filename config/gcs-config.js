const path = require("path");
const { Storage } = require("@google-cloud/storage");

const serviceKey = path.join(__dirname, "./gcs-keys.json");
const projectId = process.env.GGL_PROJECT_ID;
const bucketName = process.env.GGL_BUCKET_NAME;

const storage = new Storage({
  keyFilename: serviceKey,
  projectId: projectId,
});

exports.storage = storage;
exports.bucketName = bucketName;

// 2ND WAY OF EXPORTING FILES.
// module.exports = { storage, bucketName };
