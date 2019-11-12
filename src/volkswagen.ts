import * as puppeteer from 'puppeteer';
require('dotenv').config();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const { CARNET_USERNAME, CARNET_PASSWORD, CARNET_PIN } = process.env;
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
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--single-process'], // Required for CircleCI
    env: {
      TZ: 'America/Los_Angeles',
    },
  });
  console.log('opening new tab');
  const page = await browser.newPage();
  console.log('opening carnet login');
  await page.goto('https://carnet.vw.com/c/portal/login');
  console.log('entering username');
  await page.keyboard.type(CARNET_USERNAME);
  await page.keyboard.press('Enter');
  await page.waitForNavigation();
  console.log('entering password');
  await page.keyboard.type(CARNET_PASSWORD);
  await page.keyboard.press('Enter');
  await page.waitForNavigation();
  console.log('selecting car from garage');
  const garageButton = await page.$('a.nav-arrow');
  await garageButton.click();
  const pinInput = await page.waitForSelector('input[maxlength="4"]');
  // The input appears, then turns into a loading indicator, then re-appears
  // so hackily wait 6 seconds for it to re-appear
  await sleep(6000);
  await pinInput.focus();
  console.log('entering pin');
  await page.keyboard.type(CARNET_PIN, { delay: 100 });
  await page.keyboard.press('Enter');
  await page.waitForNavigation();
  console.log('going to trip page');
  await page.goto('https://carnet.vw.com/group/vwcwp1/trips');
  const dataElement = await page.$('[name*=tripsJson]');
  console.log('found trip data');
  const tripData = JSON.parse(await (await dataElement.getProperty('value')).jsonValue());
  await browser.close();
  console.log(tripData);
  return tripData;
}
