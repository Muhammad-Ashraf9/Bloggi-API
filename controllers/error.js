exports.notFoundErrorHandler = (req, res, next) => {
  err.statusCode = 404;
  err.messege = `404 not found`;
  res.status(404).json({ err, message: err.message });
};
exports.serverErrorHandler = (err, req, res, next) => {
  res.status(500).json({ err, message: err.message });
};
