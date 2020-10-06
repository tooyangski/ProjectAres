const { storage, bucketName } = require("../config/gcs-config");

async function uploadFile(targetFolder, filePath, fileName, folderType) {
  await storage.bucket(bucketName).upload(filePath, {
    // Support for HTTP requests made with `Accept-Encoding: gzip`
    gzip: true,
    destination: `${folderType}/${targetFolder}/${fileName}`,
    metadata: {
      // Enable long-lived HTTP caching headers
      // Use only if the contents of the file will never change
      // (If the contents will change, use cacheControl: 'no-cache')
      cacheControl: "public, max-age=31536000",
    },
  });

  const baseUrl = "https://storage.googleapis.com/";
  const contentUrl = `${bucketName}/${folderType}/${targetFolder}/${fileName}`;
  const pathUrl = baseUrl.concat(contentUrl);

  return pathUrl;
}

async function deleteFile(url) {
  var pathname = new URL(url).pathname;
  var fileName = pathname.replace(`/${bucketName}/`, "");

  // Deletes the file from the bucket
  await storage.bucket(bucketName).file(fileName).delete();

  return true;
}

exports.uploadFile = uploadFile;
exports.deleteFile = deleteFile;
