import axios from 'axios';

import { SERVER_URL_TAKE } from '../constants.js';
import { convertJsonToExcel } from '../utils/convertJsonToExcel.js';
import { sendExcelFileToUser } from '../../index.js';

import { logger } from '../utils/logger.js';

export async function getDataFromServer(ctx, days) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Отправка запроса на сервер
    const response = await axios.get(SERVER_URL_TAKE, {
      params: {
        date: startDate.toISOString(),
      },
    });

    // Обработка полученных данных
    const data = response.data;
    logger.info('Received data from the server:', data);
    ctx.reply('✅ Данные с сервера получины:');

    // const filePath = convertJsonToExcel(data); // Получаем путь к созданному Excel-файлу
    // sendExcelFileToUser(ctx, filePath); // Отправляем файл пользователю
  } catch (error) {
    logger.error('Error when receiving data from the server:', error);
    ctx.reply(
      '❌ Ошибка при загрузке данных с сервера. Пожалуйста, повторите попытку позже.'
    );
  }
}
