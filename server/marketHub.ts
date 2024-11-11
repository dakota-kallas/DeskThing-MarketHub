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

    if (this.stockCode1?.length > 0) {
      const response = await this.finnhubClient.quote(this.stockCode1);
      this.deskthing.sendLog(
        `Market Hub data received from Finnhub API for ${this.stockCode1}.`
      );

      const stock1Data = {
        code: this.stockCode1,
        current: response.data.c,
        change: response.data.d,
        percentChange: response.data.dp,
        high: response.data.h,
        low: response.data.l,
        opening: response.data.o,
        previousClose: response.data.pc,
      } as StockData;

      this.marketHubData.stock1 = stock1Data;
    }

    if (this.stockCode2?.length > 0) {
      const response = await this.finnhubClient.quote(this.stockCode2);
      this.deskthing.sendLog(
        `Market Hub data received from Finnhub API for ${this.stockCode2}.`
      );

      const stock2Data = {
        code: this.stockCode2,
        current: response.data.c,
        change: response.data.d,
        percentChange: response.data.dp,
        high: response.data.h,
        low: response.data.l,
        opening: response.data.o,
        previousClose: response.data.pc,
      } as StockData;

      this.marketHubData.stock2 = stock2Data;
    }

    if (this.stockCode3?.length > 0) {
      const response = await this.finnhubClient.quote(this.stockCode3);
      this.deskthing.sendLog(
        `Market Hub data received from Finnhub API for ${this.stockCode3}.`
      );

      const stock3Data = {
        code: this.stockCode3,
        current: response.data.c,
        change: response.data.d,
        percentChange: response.data.dp,
        high: response.data.h,
        low: response.data.l,
        opening: response.data.o,
        previousClose: response.data.pc,
      } as StockData;

      this.marketHubData.stock3 = stock3Data;
    }

    this.lastUpdateTime = new Date();

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
    }); // Update every 5 minute
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
      console.log('Updated Market Hub data');
      this.updateMarketHub();
    } catch (error) {
      this.deskthing.sendLog('Error updating Market Hub data: ' + error);
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
