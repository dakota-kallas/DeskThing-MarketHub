import { DeskThing } from 'deskthing-client';
import { SocketData } from 'deskthing-server';

export type MarketHubData = {
  /**
   * Stock #1
   */
  stock1?: StockData;
  /**
   * Stock #2
   */
  stock2?: StockData;
  /**
   * Stock #3
   */
  stock3?: StockData;
  /**
   * Stock #4
   */
  stock4?: StockData;
  /**
   * Stock #5
   */
  stock5?: StockData;
  /**
   * Stock #6
   */
  stock6?: StockData;
  /**
   * Stock #7
   */
  stock7?: StockData;
  /**
   * Stock #8
   */
  stock8?: StockData;
  /**
   * Stock #9
   */
  stock9?: StockData;
  /**
   * Stock #10
   */
  stock10?: StockData;
  /**
   * Stock #11
   */
  stock11?: StockData;
  /**
   * Stock #12
   */
  stock12?: StockData;
  /**
   * Number of Stocks configured in the Market Hub
   */
  count: number;
  /**
   * Last Refreshed Time
   */
  lastUpdated?: Date;
};
export type StockData = {
  /**
   * Code
   */
  code: string;
  /**
   * Description
   */
  description: string;
  /**
   * Current price
   */
  current: number;
  /**
   * Change
   */
  change: number;
  /**
   * Percent change
   */
  percentChange: number;
  /**
   * High price of the day
   */
  high: number;
  /**
   * Low price of the day
   */
  low: number;
  /**
   * Opening price
   */
  opening: number;
  /**
   * Previous close price
   */
  previousClose: number;
};
type MarketHubListener = (marketHubData: MarketHubData | null) => void;

export class MarketHubStore {
  private static instance: MarketHubStore | null = null;
  private marketHubData: MarketHubData | null = null;
  private deskThing: DeskThing;
  private listeners: MarketHubListener[] = [];

  constructor() {
    this.deskThing = DeskThing.getInstance();
    this.deskThing.on('markethub', (data: SocketData) => {
      this.marketHubData = data.payload as MarketHubData;
      this.notifyListeners();
    });

    this.requestMarketHubData();
  }

  static getInstance(): MarketHubStore {
    if (!MarketHubStore.instance) {
      MarketHubStore.instance = new MarketHubStore();
    }
    return MarketHubStore.instance;
  }

  on(listener: MarketHubListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
  getMarketHubData(): MarketHubData | null {
    if (!this.marketHubData) {
      this.requestMarketHubData();
    }
    return this.marketHubData;
  }

  private notifyListeners() {
    if (!this.marketHubData) {
      this.getMarketHubData();
    }
    this.deskThing.sendMessageToParent({
      app: 'client',
      type: 'log',
      payload: 'Getting Market Hub data',
    });
    console.log('notifyListeners');
    this.listeners.forEach((listener) => listener(this.marketHubData));
  }
  async requestMarketHubData(): Promise<void> {
    this.deskThing.sendMessageToParent({
      type: 'get',
      request: 'markethub_data',
    });
  }
}

export default MarketHubStore.getInstance();
