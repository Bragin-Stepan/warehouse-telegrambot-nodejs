import { markupWithActions } from '../constants.js';
import { getDataFromServer } from '../api/get.js';
import { isUserAdded } from './authorization.js';

// === Hello ===
export const commandHello = ctx => {
  const user = ctx.from.first_name;
  setTimeout(() => {
    ctx.reply(`👋 Привет, ${user}! Это склад кофейни Aristocrat.`, {
      reply_markup: markupWithActions,
    });
  }, 500);
  ctx.reply(`☕`);
  setTimeout(() => {
    if (!isUserAdded) {
      ctx.reply('🔒 Чтобы продолжить, введи пароль!', {});
    } else
      ctx.reply('Выбери действие:', {
        reply_markup: markupWithActions,
      });
    {
    }
  }, 1000);
};

// === Excel ===
export const commandExcel = ctx => {
  const command = ctx.message.text.toLowerCase();
  let daysForExcel = 0;
  if (command === '/excel30') {
    daysForExcel = 30;
    ctx.reply(`Вы получили Excel файл за 30 дней`);
  } else if (command === '/excel60') {
    daysForExcel = 60;
    ctx.reply(`Вы получили Excel файл за 60 дней`);
  } else {
    ctx.reply(`Вы получили Excel файл за все время`);
  }

  getDataFromServer(ctx, daysForExcel); // Получаем данные

  setTimeout(() => {
    ctx.reply('Выбери действие:', {
      reply_markup: markupWithActions,
    });
  }, 2000);
};
