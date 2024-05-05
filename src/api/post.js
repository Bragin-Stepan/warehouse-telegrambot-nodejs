import axios from 'axios';

import { bot } from '../../index.js';

import {
  SERVER_URL_TAKE,
  SERVER_URL_ORDERS,
  CHOOSING_AN_ACTION,
  ID_USER_TEST,
  TELEGRAM_ORDERS_CHAT_ID,
} from '../constants.js';

import { logger } from '../utils/logger.js';

// =========================  Отправляет заказ на сервер  =========================
export function sendOrderToServer(
  first_name,
  last_name,
  action,
  product,
  quantity,
  userId
) {
  // Дата
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  // Время
  const formattedTime = currentDate.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Переводит количество в 0 если ввели "нету" и т.п.
  const formattedQuantity = ['0', 'нету', 'закончилось', 'нет'].includes(
    quantity.toLowerCase()
  )
    ? 0
    : quantity;

  // Данные
  const data = {
    date: `${formattedTime} ${formattedDate}`,
    name: `${first_name}${last_name ? last_name : ''}`,
    action: action,
    product: product,
    quantity: formattedQuantity,
  };

  // Опции для запроса
  const options = {
    method: 'post',
    url: action === CHOOSING_AN_ACTION[1] ? SERVER_URL_ORDERS : SERVER_URL_TAKE,
    data: data,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Отправляет запрос на сервер
  // axios(options)
  //   .then(response => {
  console.log('The data has been successfully sent to the server:', data);
  //     logger.info('The data has been successfully sent to the server');
  //     logger.info('Server response:', response.data);
  //   })
  //   .catch(error => {
  //     logger.error('Error when sending data to the server:', error);
  //   });

  // ========================= Доп отправляет заказ в Телеграм группу

  let actionText;
  const name =
    (ID_USER_TEST === userId ? '☳ ТЕСТ ☵' : first_name) +
    (last_name ? ' ' + last_name[0] : '');
  if (action === CHOOSING_AN_ACTION[1])
    if (formattedQuantity === 0) {
      actionText = `❗${name} отправил заказ: \n\n-> ${product} <-\n\n❗НЕТУ❗`;
    } else {
      {
        actionText = `🟢 ${name} отправил заказ: \n\n-> ${product} <-\n\nОсталось: ${formattedQuantity}`;
      }
    }
  else if (action === CHOOSING_AN_ACTION[0]) {
    actionText = `🔵 ${name} взял из холодильника: \n\n-> ${product} <-\n\nКоличество: ${formattedQuantity}`;
  } else if (action === CHOOSING_AN_ACTION[2]) {
    actionText = `🔶 ${name} cписал: \n\n-> ${product} <-\n\nКоличество: ${formattedQuantity}`;
  }

  bot.api.sendMessage(TELEGRAM_ORDERS_CHAT_ID, actionText);
  logger.info('The data has been successfully sent to the telegram group');
}
