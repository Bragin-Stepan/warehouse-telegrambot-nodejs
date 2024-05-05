## Coffee Warehouse Bot

В этом репозитории содержится код для `Telegram-бота`, который управляет запасами на складе кофейни и не только.

## Функциональность

- Команды: При получении таких команд, как `/start, /hello, /hi`, бот приветствует пользователя и предоставляет варианты действий или `/Excel` бот генерирует Excel файл с данными за 30 дней и отправляет его пользователю. `(Excel еще в разработке)`
- Авторизация: Проверяет авторизацию пользователя путем проверки учетных данных на сервере и обеспечивает доступ к функциональности приложения на основе введенного пароля.
- Обработка сообщений: Бот обрабатывает сообщения пользователей для управления инвентаризационными действиями, такими как получение товаров со склада или размещение заказов.
- Отправка заказов на сервер: Бот отправляет информацию о заказе на сервер и уведомляет группу в Telegram о заказе.

## Структура кода:

- `index.js` : Это основной файл, в котором инициализируется бот и определяются команды.
- `constants.js`: Содержит константы, такие как названия продуктов, параметры количества и URL-адреса для связи с сервером.
- `commands.js` : Определяет функции для обработки команд бота.
- `bot.js`: Содержит основную логику обработки пользовательских сообщений и управления действиями с инвентаризацией.
- `authorization.js`: Содержит всю логику, свзанную с авторизацией.
- `api.js`: Содержит функции для взаимодействия с сервером (get.js для получения данных и post.js для отправки заказов).

## Технологии использовались:

- Node.JS
- Axios
- telegraf
- session
- nodemon
- dotenv
- grammY
- Логгер Pino

- Импорт через `"type": "module"` в package.json
