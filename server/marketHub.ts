import { DefaultApi } from 'finnhub-ts';
import { DeskThing } from './index';
import { DataInterface } from 'deskthing-server';
import { MarketHubData, StockData } from '../src/stores/marketHubStore';

class MarketHubService {
  private marketHubData: MarketHubData;
  private finnhubClient: DefaultApi;
  private lastUpdateTime: Date | null;
  private updateTaskId: (() => void) | null = null;
  private deskthing: typeof DeskThing;
  private static instance: MarketHubService | null = null;
  private stockCode1: string = '';
  private stockCode2: string = '';
  private stockCode3: string = '';
  private stockCode4: string = '';
  private stockCode5: string = '';
  private stockCode6: string = '';
  private stockCode7: string = '';
  private stockCode8: string = '';
  private stockCode9: string = '';
  private stockCode10: string = '';
  private stockCode11: string = '';
  private stockCode12: string = '';
  private refreshInterval: number = 5;
  private apiKey?: string = undefined;
  private count = 0;

  constructor() {
    this.deskthing = DeskThing;
    this.updateMarketHub();
    this.scheduleIntervalUpdates();
  }

  static getInstance(): MarketHubService {
    if (!MarketHubService.instance) {
      MarketHubService.instance = new MarketHubService();
    }
    return MarketHubService.instance;
  }

  private async updateMarketHub() {
    this.deskthing.sendLog(`Fetching Market Hub data from Finnhub API...`);
    this.marketHubData = {} as MarketHubData;
    this.finnhubClient = new DefaultApi({
      apiKey: this.apiKey,
      isJsonMime: (input) => {
        try {
          JSON.parse(input);
          return true;
        } catch (error) {}
        return false;
      },
    });

    this.count = 0;

    // Iterate through the stock codes and fetch the data
    for (let i = 1; i <= 12; i++) {
      const code = this[`stockCode${i}`];
      if (code && code.length > 0) {
        this.marketHubData[`stock${i}`] = await this.fetchStockData(code);
      }
    }

    this.deskthing.sendLog('Fetching Market Hub News data from Finnhub API...');
    try {
      this.marketHubData.news = (
        await this.finnhubClient.marketNews('general')
      )?.data
        .sort((a, b) => {
          // Handle undefined datetime values, treating them as oldest
          if (a.datetime === undefined) return 1;
          if (b.datetime === undefined) return -1;
          return b.datetime - a.datetime;
        })
        .slice(0, this.count > 3 ? 1 : 2)
        .map((item) => {
          const time = item.datetime ? item.datetime * 1000 : '';
          const date = new Date(time);
          const timeString = date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });

          return {
            ...item,
            time: timeString,
          };
        });
    } catch (error) {
      let message = 'Unable to fetch Market Hub News data.';
      if (error.response && error.response.status === 401) {
        // Handle invalid API key error (401 Unauthorized)
        message += ' Invalid API key or unauthorized request.';
      }
      console.error(message);
      this.deskthing.sendError(message);
      this.marketHubData.news = [];
      return undefined;
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, // Use 12-hour format (AM/PM)
    });
    this.lastUpdateTime = now;
    this.marketHubData.lastUpdated = timeString;
    this.marketHubData.count = this.count;

    this.deskthing.sendLog(`Market Hub updated`);
    this.deskthing.sendDataToClient({
      type: 'markethub_data',
      payload: this.marketHubData,
    });
  }

  private scheduleIntervalUpdates() {
    if (this.updateTaskId) {
      this.updateTaskId();
    }
    this.updateTaskId = DeskThing.addBackgroundTaskLoop(async () => {
      this.updateMarketHub();
      const interval = this.refreshInterval > 0 ? this.refreshInterval : 1;
      await this.sleep(interval * 60 * 1000);
    }); // Update every set amount of minutes
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public updateData(data: DataInterface) {
    if (!data.settings) {
      this.deskthing.sendLog('No settings defined');
      return;
    }
    try {
      this.deskthing.sendLog('Updating settings...');
      this.apiKey = (data.settings.apiKey.value as string) || undefined;
      this.refreshInterval =
        (data.settings.refreshInterval.value as number) || 5;
      this.stockCode1 = (data.settings.stockCode1.value as string) || '';
      this.stockCode2 = (data.settings.stockCode2.value as string) || '';
      this.stockCode3 = (data.settings.stockCode3.value as string) || '';
      this.stockCode4 = (data.settings.stockCode4.value as string) || '';
      this.stockCode5 = (data.settings.stockCode5.value as string) || '';
      this.stockCode6 = (data.settings.stockCode6.value as string) || '';
      this.stockCode7 = (data.settings.stockCode7.value as string) || '';
      this.stockCode8 = (data.settings.stockCode8.value as string) || '';
      this.stockCode9 = (data.settings.stockCode9.value as string) || '';
      this.stockCode10 = (data.settings.stockCode10.value as string) || '';
      this.stockCode11 = (data.settings.stockCode11.value as string) || '';
      this.stockCode12 = (data.settings.stockCode12.value as string) || '';
      this.deskthing.sendLog(`Setting up Finnhub API client: ${this.apiKey}`);
      this.finnhubClient = new DefaultApi({
        apiKey: this.apiKey,
        isJsonMime: (input) => {
          try {
            JSON.parse(input);
            return true;
          } catch (error) {}
          return false;
        },
      });
      this.updateMarketHub();
    } catch (error) {
      this.deskthing.sendLog('Error updating Market Hub data: ' + error);
    }
  }

  private async fetchStockData(stockCode: string) {
    if (!stockCode || stockCode.length === 0) return;

    try {
      const profileResponse = await this.finnhubClient.companyProfile2(
        stockCode
      );

      // Ensure the stock code exists and matches the one set by the user
      if (profileResponse.data && profileResponse.data.ticker) {
        const response = await this.finnhubClient.quote(stockCode);
        this.deskthing.sendLog(
          `Market Hub data received from Finnhub API for ${stockCode}.`
        );

        const change =
          response.data.d && response.data.d > 0
            ? '+' + response.data.d
            : response.data.d;

        const logo = profileResponse.data.logo
          ? await DeskThing.encodeImageFromUrl(profileResponse.data.logo)
          : undefined;

        const stockData = {
          code: stockCode,
          description: profileResponse.data.name,
          logo: logo,
          current: response.data.c,
          change,
          percentChange: response.data.dp,
          high: response.data.h,
          low: response.data.l,
          opening: response.data.o,
          previousClose: response.data.pc,
        } as StockData;

        this.count++;

        return stockData;
      }

      this.deskthing.sendError('Invalid stock code: ' + stockCode);

      return undefined;
    } catch (error) {
      let message = 'Unable to fetch Market Hub Stock data.';
      if (error.response && error.response.status === 401) {
        // Handle invalid API key error (401 Unauthorized)
        message += ' Invalid API key or unauthorized request.';
      }
      console.error(message);
      this.deskthing.sendError(message);
      return undefined;
    }
  }

  async stop() {
    this.lastUpdateTime = null;
  }

  public async getMarketHub(): Promise<MarketHubData> {
    // If it's been more than an hour since the last update, update the market data
    if (
      !this.lastUpdateTime ||
      new Date().getTime() - this.lastUpdateTime.getTime() > 15 * 60 * 1000
    ) {
      DeskThing.sendLog('Fetching Market Hub data...');
      await this.updateMarketHub();
    }
    DeskThing.sendLog('Returning Market Hub data');
    return this.marketHubData;
  }
}

export default MarketHubService;
