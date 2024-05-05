// === Должно быть 6 штук ===
const PRODUCTS_ARR = [
  'Молоко об',
  'Сырники',
  'Драники',
  'Помидоры',
  'Черри',
  'Яйца',
];

const QUANTITY_ARR = ['Кол-во', 'Нету', 'Отмена']; // Должен быть выбор из 3

const CHOOSING_AN_ACTION = ['Взял', 'Заказать', 'Списать']; // Должен быть выбор из 3

const SERVER_URL_USERS =
  'https://82cfa24a5c559226.mokky.dev/aristocrat_telegram_users'; // Тест API

const SERVER_URL_TAKE = 'https://82cfa24a5c559226.mokky.dev/aristocratorders'; // Тест API
const SERVER_URL_ORDERS = 'https://82cfa24a5c559226.mokky.dev/aristocratorders'; // Тест API

const PASSWORD = '00852'; // Пароль, пока что так
const TELEGRAM_ORDERS_CHAT_ID = -1002065629956; // id чата, куда бот будет отправлять уведомления (Бот должен быть модератором в этом чате)
const ID_USER_TEST = 1824416372; // Заменяет свое имя на тестовое по id или на 0 если не нужно

const HELLO_COMMANDS = ['start', 'hello', 'hi', 'Start', 'Hello', 'Hi'];
const EXCEL_COMMANDS = [
  'excel',
  'excel30',
  'excel60',
  'Excel',
  'Excel30',
  'Excel60',
];

// === Кнопки Взять, заказать или списать ===

const markupWithActions = {
  keyboard: [
    [{ text: CHOOSING_AN_ACTION[0] }],
    [{ text: CHOOSING_AN_ACTION[1] }, { text: CHOOSING_AN_ACTION[2] }],
  ],
  resize_keyboard: true,
  one_time_keyboard: true,
};

export {
  PRODUCTS_ARR,
  QUANTITY_ARR,
  CHOOSING_AN_ACTION,
  SERVER_URL_TAKE,
  SERVER_URL_ORDERS,
  SERVER_URL_USERS,
  TELEGRAM_ORDERS_CHAT_ID,
  ID_USER_TEST,
  PASSWORD,
  EXCEL_COMMANDS,
  HELLO_COMMANDS,
  markupWithActions,
};
