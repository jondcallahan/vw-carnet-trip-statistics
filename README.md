# VW Carnet trip exporter

Log your trip data for your Carnet equipped Volkswagen to a Google sheet.

[image:./sample.png]

---

This project makes use of [Puppeteer](https://github.com/GoogleChrome/puppeteer) to log in to [VW Carnet](https://carnet.vw.com/), find your trips, and append them to a Google Sheet. It comes with a [CircleCI](https://circleci.com) config to run every night at midnight pacific time.

### Questions:

##### Why use headless Chrome instead of an API?

> It’s way easier. Carnet doesn’t have a public API and I didn’t feel like reverse engineering the internal API. Using Puppeteer allowed me to spin this project up in a few hours.

##### Where can I get the environment variables needed to run this?

> This project was inspired by Evan You’s Build-your-own-mint repository. See [his instructions](https://github.com/yyx990803/build-your-own-mint#google-sheets) on obtaining the credentials needed for Google Sheets.
