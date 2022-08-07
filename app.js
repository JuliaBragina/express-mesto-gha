const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes');
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const { BAD_REQUEST, AYTH_ERROR, NOT_FOUND, CONFLICT_ERROR, SERVER_ERROR,} = require('./utils/errorCodes');
const auth = require('./middlewares/auth');
const { avatarRegExp } = require('./utils/regexp');
const { errors } = require('celebrate');

const { PORT = 3000 } = process.env;
const app = express();
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// роуты, не требующие авторизации
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(avatarRegExp),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

// авторизация
app.use(auth);

// роуты, которым авторизация нужна
app.use(router);

app.use(errors());

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страница не найдена.' });
});

app.use((err, req, res, next) => {

  if ( err.statusCode === 500 ) {
    res.status(SERVER_ERROR).send({ message: 'Произошла ошибка на стороне сервера.' });
    return;
  }
  res.status(err.statusCode).send({ message: err.message });
  next();
});

app.listen(PORT);
