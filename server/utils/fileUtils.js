/**
 * Normalizes the path of an uploaded file from multer for URL usage.
 * Replaces backslashes with forward slashes and prepends a forward slash.
 * @param {object} file - The file object from multer (req.file).
 * @returns {string|undefined} The normalized URL path for the file, or undefined if no file is provided.
 */
exports.getFilePath = (file) => {
  return file ? `/${file.path.replace(/\\/g, "/")}` : undefined;
};