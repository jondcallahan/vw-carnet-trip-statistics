import { google } from 'googleapis';
import googleClient from './googleClient';
import { discardEarlierValues, convertTo2dArray, deleteDate } from './transform';
import { ITripdata } from './volkswagen';

googleClient.setCredentials({
  access_token: process.env.SHEETS_ACCESS_TOKEN,
  refresh_token: process.env.SHEETS_REFRESH_TOKEN,
  token_type: process.env.SHEETS_TOKEN_TYPE,
  expiry_date: Number(process.env.SHEETS_EXPIRY_DATE),
});

const sheets = google.sheets({
  version: 'v4',
  auth: googleClient,
});

async function getSheetData() {
  return await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEETS_SHEET_ID,
    range: 'Sheet1',
  });
}

async function getLatestId(): Promise<string> {
  const res = await getSheetData();
  const len = res.data.values.length;
  const lastRow = res.data.values[len - 1];
  return lastRow[0];
}

export async function appendData(rawData: ITripdata[]) {
  // Fetch the most recent trip ID
  const latestId = await getLatestId();
  // Discard any values with an ID lower than the last we have recorded
  const newData = discardEarlierValues(latestId, rawData);
  // Data cleansing: remove tripDate since it is a less descriptive / dupe of dateTime
  const formattedData = deleteDate(newData);
  // Data formatting: put into a two-dimensional array so G Sheets can understand it
  const values = convertTo2dArray(formattedData);
  console.log('Pusing updates: ', values);
  return await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SHEETS_SHEET_ID,
    range: 'Sheet1',
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    includeValuesInResponse: true,
    requestBody: {
      values,
    },
  });
}
