import { DefaultApi } from 'finnhub-ts';
import { DeskThing } from './index';
import { DataInterface } from 'deskthing-server';
import { MarketData } from '../src/stores/marketStore';

class MarketService {
  private marketData: MarketData;
  private finnhubClient: DefaultApi;
  private lastUpdateTime: Date | null;
  private updateTaskId: (() => void) | null = null;
  private deskthing: typeof DeskThing;
  private static instance: MarketService | null = null;
  private stockCode: string = '';

  constructor() {
    this.deskthing = DeskThing;
    this.updateMarket();
    this.scheduleHourlyUpdates();
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

  static getInstance(): MarketService {
    if (!MarketService.instance) {
      MarketService.instance = new MarketService();
    }
    return MarketService.instance;
  }

  private async updateMarket() {
    console.log('Updating market data...');
    this.deskthing.sendLog(`Fetching market data from Finnhub API.`);
    if (this.stockCode?.length > 0) {
      const response = await this.finnhubClient.quote(this.stockCode);
      this.deskthing.sendLog(`Market data received from Finnhub API.`);

      this.marketData = {
        c: response.data.c,
        d: response.data.d,
        dp: response.data.dp,
        h: response.data.h,
        l: response.data.l,
        o: response.data.o,
        pc: response.data.pc,
      };
    }

    this.lastUpdateTime = new Date();

    this.deskthing.sendLog('Market updated');
    this.deskthing.sendDataToClient({
      type: 'market_data',
      payload: this.marketData,
    });
  }

  private scheduleHourlyUpdates() {
    if (this.updateTaskId) {
      this.updateTaskId();
    }
    this.updateTaskId = DeskThing.addBackgroundTaskLoop(async () => {
      this.updateMarket();
      await this.sleep(1 * 60 * 1000);
    }); // Update every 1 minute
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
      console.log('Updating market data to', data);
      this.stockCode =
        (data.settings.stockCode.value as string) || '';
      console.log('Updated market data', this.stockCode);
      this.updateMarket();
    } catch (error) {
      this.deskthing.sendLog('Error updating market data: ' + error);
    }
  }

  async stop() {
    this.lastUpdateTime = null;
  }

  public async getMarket(): Promise<MarketData> {
    // If it's been more than an hour since the last update, update the market data
    if (
      !this.lastUpdateTime ||
      new Date().getTime() - this.lastUpdateTime.getTime() > 15 * 60 * 1000
    ) {
      DeskThing.sendLog('Fetching market data...');
      await this.updateMarket();
    }
    DeskThing.sendLog('Returning market data');
    return this.marketData;
  }
}

export default MarketService;
