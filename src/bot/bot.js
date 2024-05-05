import {
  PRODUCTS_ARR,
  QUANTITY_ARR,
  CHOOSING_AN_ACTION,
  ID_USER_TEST,
  markupWithActions,
} from '../constants.js';

import { logger } from '../utils/logger.js';

import { sendOrderToServer } from '../api/post.js';

// ==========================================================

let userChoices = {};
let isCustomProductName = {};

export const processMessage = ctx => {
  const text = ctx.message.text;
  const chatId = ctx.chat.id;

  try {
    if (!userChoices[chatId]) {
      userChoices[chatId] = { action: null, product: null, quantity: null };
    }

    // Выбор действия
    if (
      text === CHOOSING_AN_ACTION[0] ||
      text === CHOOSING_AN_ACTION[1] ||
      text === CHOOSING_AN_ACTION[2]
    ) {
      logger.info('The user started to choose...');
      userChoices[chatId]['action'] = text;
      ctx.reply('Выбери продукт:', {
        reply_markup: {
          keyboard: [
            [{ text: 'Свое' }],
            PRODUCTS_ARR.slice(0, 3).map(product => ({ text: product })),
            PRODUCTS_ARR.slice(3).map(product => ({ text: product })),
            [{ text: QUANTITY_ARR[2] }],
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      });
    } else if (text === 'Свое') {
      ctx.reply('Введи название продукта:', {
        reply_markup: {
          remove_keyboard: true,
        },
      });
      isCustomProductName[chatId] = true;
    } else if (PRODUCTS_ARR.includes(text)) {
      let userChoicesAction;
      if (userChoices[chatId]['action'] === CHOOSING_AN_ACTION[1]) {
        userChoicesAction = 'Сколько взяли:';
      } else if (userChoices[chatId]['action'] === CHOOSING_AN_ACTION[1]) {
        userChoicesAction = 'Введи количество остатка:';
      } else {
        userChoicesAction = 'Сколько:';
      }
      userChoices[chatId]['product'] = text;
      ctx.reply(userChoicesAction, {
        reply_markup: {
          keyboard:
            userChoices[chatId]['action'] === CHOOSING_AN_ACTION[1]
              ? [
                  [{ text: QUANTITY_ARR[0] }, { text: QUANTITY_ARR[1] }],
                  [{ text: QUANTITY_ARR[2] }],
                ]
              : [[{ text: QUANTITY_ARR[0] }], [{ text: QUANTITY_ARR[2] }]],

          resize_keyboard: true,
          one_time_keyboard: true,
        },
      });
      // }
    } else if (QUANTITY_ARR.includes(text)) {
      if (text === 'Кол-во') {
        userChoices[chatId]['quantity'] = text;
        ctx.reply('Введи количество:', {
          reply_markup: {
            remove_keyboard: true,
          },
        });
      } else if (text === 'Нету') {
        userChoices[chatId]['quantity'] = text;
        confirmAction(ctx, chatId);
      } else if (text === QUANTITY_ARR[2]) {
        delete userChoices[chatId];
        logger.info('The user canceled the order');
        ctx.reply('Выбери действие:', {
          reply_markup: { markupWithActions },
        });
      }
    } else if (isCustomProductName[chatId] === true) {
      userChoices[chatId]['product'] = text;

      let userChoicesAction;
      if (userChoices[chatId]['action'] === CHOOSING_AN_ACTION[1]) {
        userChoicesAction = 'Сколько взяли:';
      } else if (userChoices[chatId]['action'] === CHOOSING_AN_ACTION[1]) {
        userChoicesAction = 'Введи количество остатка:';
      } else {
        userChoicesAction = 'Сколько сколько:';
      }
      ctx.reply(userChoicesAction, {
        reply_markup: {
          remove_keyboard: true,
        },
      });
      isCustomProductName[chatId] = false;
    } else {
      if (!userChoices[chatId]['action'] || !userChoices[chatId]['product']) {
        delete userChoices[chatId];
        ctx.reply('❌ Ошибка, попробуй снова.', {
          reply_markup: markupWithActions,
        });
        return;
      }

      userChoices[chatId]['quantity'] = text;
      logger.info('The user has confirmed his choice');
      confirmAction(ctx, chatId);
    }
  } catch (error) {
    logger.error('Error processing user input:', error);
  }
};
// =========================
function confirmAction(ctx, chatId) {
  const action = userChoices[chatId]['action'];

  let actionText;
  if (action === CHOOSING_AN_ACTION[1]) {
    if (
      userChoices[chatId]['quantity'] === 'Нету' ||
      userChoices[chatId]['quantity'] === '0'
    ) {
      actionText = `🟢 Заказ отправлен:\n\n${userChoices[chatId]['product']}, ❗НЕТУ❗`;
    } else {
      actionText = `🟢 Заказ отправлен:\n\n${userChoices[chatId]['product']}, осталось -> ${userChoices[chatId]['quantity']} <-`;
    }
  } else if (action === CHOOSING_AN_ACTION[0]) {
    actionText = `🔵 Взял из холодильника:\n\n${userChoices[chatId]['product']}, количество -> ${userChoices[chatId]['quantity']} <-`;
  } else if (action === CHOOSING_AN_ACTION[2]) {
    actionText = `🔶 Списал:\n\n${userChoices[chatId]['product']}, количество -> ${userChoices[chatId]['quantity']} <-`;
  } else {
    actionText = '❌ Выбрано неверное действие';
  }

  ctx.reply(actionText, {
    reply_markup: {
      remove_keyboard: true,
    },
  });

  // Отправляет данные на сервер
  if (action !== null) {
    sendOrderToServer(
      ctx.from.id === ID_USER_TEST ? 'ТЕСТ' : ctx.from.first_name,
      ctx.from.last_name,
      action,
      userChoices[chatId]['product'],
      userChoices[chatId]['quantity']
    );
  }

  // Сброс выбора
  delete userChoices[chatId];

  // Таймер
  setTimeout(() => {
    ctx.reply('Выбери действие:', {
      reply_markup: markupWithActions,
    });
  }, 500);
}
