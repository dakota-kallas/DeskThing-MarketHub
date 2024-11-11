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
  private count = 0;

  constructor() {
    this.deskthing = DeskThing;
    this.updateMarketHub();
    this.scheduleIntervalUpdates();
    this.finnhubClient = new DefaultApi({
      apiKey: 'csn5lk9r01qqapai51vgcsn5lk9r01qqapai5200',
      isJsonMime: (input) => {
        try {
          JSON.parse(input);
          return true;
        } catch (error) {}
        return false;
      },
    });
  }

  static getInstance(): MarketHubService {
    if (!MarketHubService.instance) {
      MarketHubService.instance = new MarketHubService();
    }
    return MarketHubService.instance;
  }

  private async updateMarketHub() {
    console.log('Updating Market Hub data...');
    this.deskthing.sendLog(`Fetching Market Hub data from Finnhub API.`);
    this.marketHubData = {} as MarketHubData;

    this.count = 0;

    if (this.stockCode1 && this.stockCode1.length > 0) {
      this.marketHubData.stock1 = await this.fetchStockData(this.stockCode1);
    }
    if (this.stockCode2 && this.stockCode2.length > 0) {
      this.marketHubData.stock2 = await this.fetchStockData(this.stockCode2);
    }
    if (this.stockCode3 && this.stockCode3.length > 0) {
      this.marketHubData.stock3 = await this.fetchStockData(this.stockCode3);
    }
    if (this.stockCode4 && this.stockCode4.length > 0) {
      this.marketHubData.stock4 = await this.fetchStockData(this.stockCode4);
    }
    if (this.stockCode5 && this.stockCode5.length > 0) {
      this.marketHubData.stock5 = await this.fetchStockData(this.stockCode5);
    }
    if (this.stockCode6 && this.stockCode6.length > 0) {
      this.marketHubData.stock6 = await this.fetchStockData(this.stockCode6);
    }
    if (this.stockCode7 && this.stockCode7.length > 0) {
      this.marketHubData.stock7 = await this.fetchStockData(this.stockCode7);
    }
    if (this.stockCode8 && this.stockCode8.length > 0) {
      this.marketHubData.stock8 = await this.fetchStockData(this.stockCode8);
    }
    if (this.stockCode9 && this.stockCode9.length > 0) {
      this.marketHubData.stock9 = await this.fetchStockData(this.stockCode9);
    }
    if (this.stockCode10 && this.stockCode10.length > 0) {
      this.marketHubData.stock10 = await this.fetchStockData(this.stockCode10);
    }
    if (this.stockCode11 && this.stockCode11.length > 0) {
      this.marketHubData.stock11 = await this.fetchStockData(this.stockCode11);
    }
    if (this.stockCode12 && this.stockCode12.length > 0) {
      this.marketHubData.stock12 = await this.fetchStockData(this.stockCode12);
    }

    if (this.count <= 3) {
      this.deskthing.sendLog('Fetching Market Hub News data from Finnhub API.');
      this.marketHubData.news = (
        await this.finnhubClient.marketNews('general')
      )?.data;
    }

    this.lastUpdateTime = new Date();
    this.marketHubData.lastUpdated = this.lastUpdateTime;
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
      await this.sleep(5 * 60 * 1000);
    }); // Update every 5 minutes
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
      this.deskthing.sendLog('Updating settings');
      console.log('Updating Market Hub data to', data);
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
      console.log('Updated Market Hub data');
      this.updateMarketHub();
    } catch (error) {
      this.deskthing.sendLog('Error updating Market Hub data: ' + error);
    }
  }

  private async fetchStockData(stockCode: string) {
    if (!stockCode || stockCode.length === 0) return;

    const profileResponse = await this.finnhubClient.companyProfile2(stockCode);

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

      const stockData = {
        code: stockCode,
        description: profileResponse.data.name,
        logoURL: profileResponse.data.logo,
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

    return undefined;
  }

  private formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
