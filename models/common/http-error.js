class HttpError extends Error {
  constructor(message, errorCode, stackTrace) {
    super(message); // Add a "message" property
    this.code = errorCode; // Adds a "code" property
    this.stackTrace = stackTrace; // Adds a "stackTrace" property
  }
}

module.exports = HttpError;
