const { request } = require('express');
const Card = require('../models/card');
const { ForbiddenError } = require('../utils/errors/ForbiddenError');
const { NotFoundError } = require('../utils/errors/NotFoundError');
const { BadRequestError } = require('../utils/errors/BadRequestError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user.id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для создания карточки.'));
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id.');
      }
      if (card.owner.equals(req.user.id)) {
        return card.delete()
          .then(() => res.send({ message: 'Карточка удалена.' }));
      } else {
        throw new ForbiddenError('Нельзя удалять чужую карточку.');
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const owner = req.user.id;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: owner } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id.');
      }
      res.send(card);
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const owner = req.user.id;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: owner } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id.');
      }
      res.send(card);
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
