function errorHandle(res, err) {
  let message = '';

  if (err) {
    message = err.message;
  } else {
    message = '欄位未填寫正確或查無此ID';
  }

  res.status(400).send({
    status: false,
    message,
  });
  res.end();
}

module.exports = errorHandle;
