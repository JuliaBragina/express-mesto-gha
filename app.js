const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const router = require('./routes');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { avatarRegExp } = require('./utils/regexp');
const { NotFoundError } = require('./utils/errors/NotFoundError');

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
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(avatarRegExp),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

// авторизация
app.use(auth);

// роуты, которым авторизация нужна
app.use(router);

app.use(errors());

app.use((req, res) => {
  throw new NotFoundError('Страница не найдена.');
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  next();
});

app.listen(PORT);
