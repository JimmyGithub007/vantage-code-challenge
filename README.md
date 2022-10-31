# vantage-code-challenge

An mobile responsive application which will load the list of exchange rates from an API and present them to users, built with React, SCSS.

### Done on requirement(s)
1. Using ReactJS
2. A project that runs on Google Chrome
3. README detailing how to compile/ run the app
4. Responsible web application
5. Handle not network connectivity (PWA)

### 💻 Live [Demo](https://vantage-code-challenge.netlify.app/)

## Project Screen Shot(s)
![screenshot](https://user-images.githubusercontent.com/47911072/198977358-9d3306c3-f73c-4b7c-ba19-0b85a4701e25.png)

## Installation and Setup Instructions

#### Example:  

Clone down this repository. You will need `node` and `npm` installed globally on your machine.  

Change ENV

Change the .env.example to .env and adding the `https://api.coingecko.com/api/v3/exchange_rates` into `REACT_APP_API_URL`

Installation:

`npm install`  

To Start Server:

`npm start`

To Visit App:

`localhost:3000`

If want to test the service worker for offline, please try on production mode

To Start Server:

`npm run build`

You will need `serve` installed globally on your machine.

`npm install -g serve`

Then can run

`serve -s build`
