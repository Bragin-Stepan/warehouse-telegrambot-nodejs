import dotenv from 'dotenv';
dotenv.config();

import { EXCEL_COMMANDS, HELLO_COMMANDS } from './scripts/constants.js';
import { commandHello, commandExcel } from './scripts/bot/commands.js';
import { processMessage } from './scripts/bot/bot.js';
import { authorization, isUserAdded } from './scripts//bot/authorization.js';

import { Bot, session } from 'grammy';

export const bot = new Bot(process.env.TOKEN);

bot.use(session({ initial: () => ({ authenticated: false }) }));

// Старт и другие команды
bot.command(HELLO_COMMANDS, commandHello);
bot.command(EXCEL_COMMANDS, commandExcel);

// Основной код
bot.on('message', ctx => {
  if (ctx.session.authenticated === false && isUserAdded === false) {
    authorization(ctx); // Авторизация
  } else {
    processMessage(ctx); // Бот
  }
});

export function sendExcelFileToUser(ctx, filePath) {
  const chatId = ctx.chat.id;
  bot.api.sendDocument(chatId, { source: filePath });
}

try {
  bot.start();
} catch (error) {
  console.error('Error starting the bot:', error);
}
