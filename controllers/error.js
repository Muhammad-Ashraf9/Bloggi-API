exports.notFoundErrorHandler = (req, res, next) => {
  err.statusCode = 404;
  err.messege = `404 not found`;
  res.send({ err: err, messege: err.messege });
};
exports.serverErrorHandler = (err, req, res, next) => {
  res.send({ err: err, messege: err.messege });
};
