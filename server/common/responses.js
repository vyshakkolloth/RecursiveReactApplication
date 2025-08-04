// Common response helpers

exports.success = (res, data, status = 200) => {
  res.status(status).json({
    status: 'success',
    data
  });
};

exports.created = (res, data) => {
  res.status(201).json({
    status: 'success',
    data
  });
};

exports.error = (res, message, status = 500) => {
  res.status(status).json({
    status: 'error',
    message
  });
};

exports.noContent = (res) => {
  res.status(204).send();
};
