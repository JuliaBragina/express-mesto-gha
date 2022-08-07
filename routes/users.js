const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getUsers, getUser, getUserMe, updateUser, updateUserAvatar,
} = require('../controllers/users');
const { avatarRegExp } = require('../utils/regexp');

router.get('/users', getUsers);

router.get('/users/me', getUserMe);

router.get('/users/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), getUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(avatarRegExp),
  }),
}), updateUserAvatar);

module.exports = router;
