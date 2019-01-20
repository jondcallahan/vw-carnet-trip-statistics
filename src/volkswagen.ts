import * as puppeteer from 'puppeteer';
require('dotenv').config();

const { USERNAME, PASSWORD, PIN } = process.env;
export interface ITripdata {
  vehicleStatisticsId: string;
  dateTime: string;
  tripDate: string;
  distance: number;
  averageSpeed: number;
  totalConsumption: number;
  travelTime: number;
}
export async function getTripData(): Promise<ITripdata[]> {
  const browser = await puppeteer.launch({ headless: true });
  console.log('opening new tab');
  const page = await browser.newPage();
  console.log('Opening carnet login');
  await page.goto('https://carnet.vw.com/web/vwcwp/login');
  await page.keyboard.type(USERNAME);
  await page.keyboard.press('Tab');
  await page.keyboard.type(PASSWORD);
  await page.keyboard.press('Enter');
  await page.waitForNavigation();
  console.log('entering pin');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.type(PIN);
  await page.keyboard.press('Enter');
  await page.waitForNavigation();
  console.log('going to trip page');
  await page.goto('https://carnet.vw.com/group/vwcwp/trips');
  const dataElement = await page.$(
    '#_tripstatisticsportlet_WAR_tripstatisticsportlet_tripsJson'
  );
  console.log('found trip data');
  const tripData = JSON.parse(await (await dataElement.getProperty('value')).jsonValue());
  await browser.close();
  console.log(tripData);
  return tripData;
}
