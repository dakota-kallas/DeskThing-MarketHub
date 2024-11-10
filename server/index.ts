import { DeskThing as DK, SettingsString, SocketData } from 'deskthing-server';
const DeskThing = DK.getInstance();
export { DeskThing }; // Required export of this exact name for the server to connect
import MarketService from './market';

const start = async () => {
  const market = MarketService.getInstance();
  let Data = await DeskThing.getData();
  DeskThing.on('data', (newData) => {
    // Syncs the data with the server
    Data = newData;
    if (Data) {
      console.log('Data updating');
      market.updateData(Data);
    }
  });

  // This is how to add settings (implementation may vary)
  if (!Data?.settings?.stockCode) {
    setupSettings();
  }

  const handleGet = async (request: SocketData) => {
    if (request.request === 'market_data') {
      DeskThing.sendLog('Getting market data');
      const marketData = await market.getMarket();
      if (marketData) {
        DeskThing.sendDataToClient({
          type: 'market_data',
          payload: marketData,
        });
      } else {
        console.log('Error getting market data');
      }
    }
  };

  DeskThing.on('get', handleGet);
  const stop = async () => {
    market.stop();
  };
  DeskThing.on('stop', stop);
};

const setupSettings = async () => {
  const stockCodeSetting = {
    label: 'Stock Code',
    description: 'The stock code of the company you want to track.',
    type: 'string',
  } as SettingsString;

  DeskThing.addSettings({
    stockCode: stockCodeSetting,
  });
};

// Main Entrypoint of the server
DeskThing.on('start', start);
