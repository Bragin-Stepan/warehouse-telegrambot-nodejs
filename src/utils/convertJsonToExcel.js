import json2xls from 'json2xls';
import fs from 'fs';

export function convertJsonToExcel(data) {
  const xls = json2xls(data);
  const filePath = 'data.xlsx';
  fs.writeFileSync(filePath, xls, 'binary');
  return filePath;
}
