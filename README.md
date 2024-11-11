# DeskThing-MarketHub

The Market Hub app for DeskThing offers a quick-access, at-a-glance view of selected stocks. It uses the [Finnhub API](https://finnhub.io).

![image](https://github.com/user-attachments/assets/cce90152-fc7c-41d8-9604-a33ebb831f97)

![image](https://github.com/user-attachments/assets/ea712b0d-7864-47fa-980f-e93436280c56)

## Features

- **Stock Tracker**: Track stock data using company ticker symbols. (Supports up to 12 stocks at one time)
- **Real-Time Market News**: Fetches up-to-date information about market news.

## Installation

### Prerequisites

Make sure you have the following installed:

- [DeskThing](https://deskthing.app/)
- A valid [Finnhub API Key](https://finnhub.io/docs/api) for accessing stock data. (FREE on [Signup](https://finnhub.io/dashboard))

### Setup

Current as of DeskThing v0.9.2

1. Download the latest release build
2. Navigate to the `Downloads > App` tab and click on `Upload App`
   - <img src="https://github.com/user-attachments/assets/7da9db21-64c5-4c55-898a-de97b9e6f1c1" height="300" />
3. Select the `build.zip` file that was downloaded
4. Navigate to the `Settings` of `Market Hub`
5. Enter your desired configuration
   - Enter your [Finnhub API](https://finnhub.io/dashboard) Key
   - Any Stock Codes you'd like to track
6. Save the Settings
7. Reset your client state by navigating to the `Menu` of you **DeskThing** on your client (Car Thing)
   - The far-right button on your **Spotify Car Thing** (or press the `M` key on other clients)

## Usage

1. Upon starting the loading that app onto your DeskThing, you will be able to input the stock codes (e.g., `AAPL` for Apple or `GOOG` for Google).
   - Navigate to Settings to enter desired stock codes & API Key.
2. The app will fetch the data for the selected stock and display:
   - Stock ticker
   - Current price
   - Daily change (both absolute and percentage)
   - High/Low for the day
   - Opening price
   - Previous close
   - Company description and logo
3. The data will be automatically updated based on the stock codes you enter.

## API Integration

The app integrates with the [Finnhub API](https://finnhub.io/docs/api), using the following endpoints:

- `companyProfile2`: Fetches basic company information (e.g., logo, description).
- `quote`: Fetches real-time stock price data.
- `marketNews`: Fetches real-time market news.

## Troubleshooting

### Stocks & News not loading

1. Check to see if you are getting an error message on your DeskThing Server
   - If you are getting a messaged related to `Invalid API Key`, ensure you've configured your valid [Finnhub API Key](https://finnhub.io/docs/api).
2. If you are not recieving an error message, refer to `Step 7` of the **Setup**

### Data not refreshing

1. Check you've properly configured your `Refresh Interval` in the `Settings` page for **Market Hub**

## Contributing

Create a pull request and described the added / modified functionality.
