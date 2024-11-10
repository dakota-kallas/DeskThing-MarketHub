import { DeskThing as DK, SettingsString, SocketData } from 'deskthing-server';
const DeskThing = DK.getInstance();
export { DeskThing }; // Required export of this exact name for the server to connect
import MarketHubService from './marketHub';

const start = async () => {
  const marketHub = MarketHubService.getInstance();
  let Data = await DeskThing.getData();
  DeskThing.on('data', (newData) => {
    // Syncs the data with the server
    Data = newData;
    if (Data) {
      console.log('Data updating');
      marketHub.updateData(Data);
    }
  });

  // This is how to add settings (implementation may vary)
  if (!Data?.settings?.stockCode) {
    setupSettings();
  }

  const handleGet = async (request: SocketData) => {
    if (request.request === 'markethub_data') {
      DeskThing.sendLog('Getting Market Hub data');
      const marketData = await marketHub.getMarketHub();
      if (marketData) {
        DeskThing.sendDataToClient({
          type: 'markethub_data',
          payload: marketData,
        });
      } else {
        console.log('Error getting Market Hub data');
      }
    }
  };

  DeskThing.on('get', handleGet);
  const stop = async () => {
    marketHub.stop();
  };
  DeskThing.on('stop', stop);
};

const setupSettings = async () => {
  const stockCodeSetting = {
    label: 'Stock Code',
    description: 'The stock code you want to track.',
    type: 'string',
  } as SettingsString;

  DeskThing.addSettings({
    stockCode: stockCodeSetting,
  });
};

// Main Entrypoint of the server
DeskThing.on('start', start);
