const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundError, BadRequestError, ConflictError } = require('../utils/errors');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUser = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if ( !user ) {
        throw new NotFoundError('Нет пользователя с таким id.');
      }
      res.send(user);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then(hash => {
      User.create({ name, about, avatar, email, password: hash })
      .then((user) => res.status(201).send(user))
      .catch((err) => {
        if (err.code === 11000) {
          next( new ConflictError('Пользователь с такими данными уже существует.') );
          return;
        }
        next(err);
      });
    })
    .catch(next);
};

function getUserMe(req, res, next) {
  const userId = req.user.id;
  User.findById(userId)
    .then((user) => res.send(user))
    .catch(next);
};

function updateUser(req, res, next) {
  const userId = req.user.id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next( new BadRequestError('Данные не прошли валидацию на сервере.') );
        return;
      }
      next(err);
    });
}

const updateUserAvatar = (req, res, next) => {
  const userId = req.user.id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then((user) => res.send(user))
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Неверные логин или пароль");
      }
      bcrypt.compare(password, user.password, (e, isValid) => {
        console.log(isValid);
        if (!isValid) {
          next( new NotFoundError("Неверные логин или пароль") );
          return;
        }
        const token = jwt.sign({ id: user._id}, 'some-secret-key', {expiresIn: '7d'});
        return res.cookie('jwt', token, {maxAge: 3600000 * 24 * 7, httpOnly: true}).end();
      });
    })
    .catch(next);
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  getUserMe,
  updateUser,
  updateUserAvatar,
  login,
};
