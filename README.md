[![Tests](https://github.com/yandex-praktikum/express-mesto-gha/actions/workflows/tests-13-sprint.yml/badge.svg)](https://github.com/yandex-praktikum/express-mesto-gha/actions/workflows/tests-13-sprint.yml) [![Tests](https://github.com/yandex-praktikum/express-mesto-gha/actions/workflows/tests-14-sprint.yml/badge.svg)](https://github.com/yandex-praktikum/express-mesto-gha/actions/workflows/tests-14-sprint.yml)

# Проект Mesto back-end

## О проекте

Данный проект - это backend для сервиса Mesto, реализованный с помощью фреймворка Express.

## Описание

В данном проекте отрабатывались следующие навыки: 
- работа с базой данных MongoDB
  - реализовано подключение к БД,
  - создание схемы и модели пользователя и карточки, 
- релизованы контроллеры и роуты для пользователей и карточек, 
- реализована централизованная обработка ошибок,
- защищены все маршруты, которым необходима авторизация,
- валидация выполнена:
  - с помощью Joi и celebrate,
  - регулярными выражениями,
  - модулем validator.

Тестирование запросов выполнялось в Postman.

## Стек: 

- Express
- MongoDB

## Запуск проекта

`npm run start` — запускает сервер   
`npm run dev` — запускает сервер с hot-reload

## Настройка бейджей статуса тестов
```
[![Tests for sprint 13](https://github.com/${JuliaBragina}/${express-mesto-gha}/actions/workflows/tests-13-sprint.yml/badge.svg)](https://github.com/${JuliaBragina}/${express-mesto-gha}/actions/workflows/tests-13-sprint.yml) 

[![Tests for sprint 14](https://github.com/${JuliaBragina}/${express-mesto-gha}/actions/workflows/tests-14-sprint.yml/badge.svg)](https://github.com/${JuliaBragina}/${express-mesto-gha}/actions/workflows/tests-14-sprint.yml)
```
