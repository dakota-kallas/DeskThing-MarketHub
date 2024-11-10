import { DeskThing } from 'deskthing-client';
import { SocketData } from 'deskthing-server';

export type MarketData = {
  /**
   * Current price
   */
  c?: number;
  /**
   * Change
   */
  d?: number;
  /**
   * Percent change
   */
  dp?: number;
  /**
   * High price of the day
   */
  h?: number;
  /**
   * Low price of the day
   */
  l?: number;
  /**
   * Opening price
   */
  o?: number;
  /**
   * Previous close price
   */
  pc?: number;
};
type MarketListener = (marketData: MarketData | null) => void;

export class MarketStore {
  private static instance: MarketStore | null = null;
  private marketData: MarketData | null = null;
  private deskThing: DeskThing;
  private listeners: MarketListener[] = [];

  constructor() {
    this.deskThing = DeskThing.getInstance();
    this.deskThing.on('market', (data: SocketData) => {
      this.marketData = data.payload as MarketData;
      this.notifyListeners();
    });

    this.requestMarketData();
  }

  static getInstance(): MarketStore {
    if (!MarketStore.instance) {
      MarketStore.instance = new MarketStore();
    }
    return MarketStore.instance;
  }

  on(listener: MarketListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
  getMarketData(): MarketData | null {
    if (!this.marketData) {
      this.requestMarketData();
    }
    return this.marketData;
  }

  private notifyListeners() {
    if (!this.marketData) {
      this.getMarketData();
    }
    this.deskThing.sendMessageToParent({
      app: 'client',
      type: 'log',
      payload: 'getting marketData',
    });
    console.log('notifyListeners');
    this.listeners.forEach((listener) => listener(this.marketData));
  }
  async requestMarketData(): Promise<void> {
    this.deskThing.sendMessageToParent({
      type: 'get',
      request: 'market_data',
    });
  }
}

export default MarketStore.getInstance();
