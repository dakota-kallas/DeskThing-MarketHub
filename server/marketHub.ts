import { DefaultApi } from 'finnhub-ts';
import { DeskThing } from './index';
import { DataInterface } from 'deskthing-server';
import { MarketHubData } from '../src/stores/marketHubStore';

class MarketHubService {
  private marketHubData: MarketHubData;
  private finnhubClient: DefaultApi;
  private lastUpdateTime: Date | null;
  private updateTaskId: (() => void) | null = null;
  private deskthing: typeof DeskThing;
  private static instance: MarketHubService | null = null;
  private stockCode: string = '';

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
    this.deskthing.sendLog(`Fetching Market Hub data from Finnhub API: ${this.stockCode}`);
    if (this.stockCode?.length > 0) {
      const response = await this.finnhubClient.quote(this.stockCode);
      this.deskthing.sendLog(`Market Hub data received from Finnhub API.`);

      this.marketHubData = {
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
      this.stockCode =
        (data.settings.stockCode.value as string) || '';
      console.log('Updated Market Hub data', this.stockCode);
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
