const jwt = require('jsonwebtoken');
const { AYTH_ERROR } = require('../utils/errorCodes');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(AYTH_ERROR).send({ message: 'Необходима авторизация.' });
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch {
    res.status(AYTH_ERROR).send({ message: 'Необходима авторизация.' });
    return;
  }
  req.user = payload;
  next();
};
