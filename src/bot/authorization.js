import axios from 'axios';

import { PASSWORD, SERVER_URL_USERS, markupWithActions } from '../constants.js';

import { logger } from '../utils/logger.js';

export let isUserAdded = false;

export const authorization = async ctx => {
  const userId = ctx.from.id;
  const userName = ctx.from.first_name;
  const passwordAttempt = ctx.message.text;

  let attemptСounter = 0; // пусть будет :D

  // Аутентифицирован ли уже пользователь
  try {
    logger.info('Checking the user...');
    await axios.get(`${SERVER_URL_USERS}/${userId}`); // Есть ли пользователь?
    isUserAdded = true;
    logger.info('The user was successfully found');
  } catch (error) {
    logger.info('The user is not in the database yet');
    if (error.response && error.response.status === 404) {
    } else {
      logger.error('Error checking the users existence:', error);
      ctx.reply(
        '❌ Произошла ошибка при проверке существования пользователя. Пожалуйста, попробуйте еще раз или позже.'
      );
      return;
    }
  }
  if (isUserAdded) {
    ctx.session.authenticated = true;
    ctx.reply('✅ Ты уже прошел аутентификацию ранее!');
    ctx.reply('Выбери действие:', {
      reply_markup: markupWithActions,
    });
  } else {
    // Проверяет пароль
    if (passwordAttempt === PASSWORD) {
      logger.info('The password has been entered successfully');
      try {
        logger.info('Sending an authorized user to the server...');
        await axios.post(SERVER_URL_USERS, {
          id: userId,
          userId: userId,
          userName: userName,
        });
        ctx.session.authenticated = true;
        logger.info('[+] The user has successfully logged in');
        ctx.reply('✅ Ты успешно прошел аутентификацию!');
        ctx.reply('Выбери действие:', {
          reply_markup: markupWithActions,
        });
        return;
      } catch (error) {
        logger.error('Password verification error:', error);
        ctx.reply(
          '❌ Произошла ошибка при проверке пароля. Пожалуйста, попробуйте позже.'
        );
      }
    } else {
      logger.info('[x] The password was entered incorrectly');
      attemptСounter = attemptСounter + 1;
      if (attemptСounter < 3) {
        ctx.reply('❌ Неверный пароль. Попробуй еще раз.');
      } else if (attemptСounter <= 5) {
        ctx.reply('❌ Неа, неверный пароль!');
      } else if (attemptСounter === 6) {
        ctx.reply('Может лучше пивка 🍻, а не вот это вот все?');
      } else {
        ctx.reply('❌ Неверный пароль❗ ❌');
      }
    }
  }
};
