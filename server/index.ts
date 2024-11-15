import {
  DeskThing as DK,
  SettingsNumber,
  SettingsString,
  SocketData,
} from 'deskthing-server';
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
      marketHub.updateData(Data);
    }
  });

  // This is how to add settings (implementation may vary)
  if (
    !Data?.settings?.stockCode1 ||
    !Data?.settings?.stockCode2 ||
    !Data?.settings?.stockCode3 ||
    !Data?.settings?.stockCode4 ||
    !Data?.settings?.stockCode5 ||
    !Data?.settings?.stockCode6 ||
    !Data?.settings?.stockCode7 ||
    !Data?.settings?.stockCode8 ||
    !Data?.settings?.stockCode9 ||
    !Data?.settings?.stockCode10 ||
    !Data?.settings?.stockCode11 ||
    !Data?.settings?.stockCode12 ||
    !Data?.settings?.apiKey ||
    !Data?.settings?.refreshInterval
  ) {
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
        console.warn('Error getting Market Hub data');
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
  const stockCode1Setting = {
    label: 'Stock Code #1',
    description: 'The 1st stock code you want to track.',
    type: 'string',
  } as SettingsString;

  const stockCode2Setting = {
    label: 'Stock Code #2',
    description: 'The 2nd stock code you want to track.',
    type: 'string',
  } as SettingsString;

  const stockCode3Setting = {
    label: 'Stock Code #3',
    description: 'The 3rd stock code you want to track.',
    type: 'string',
  } as SettingsString;

  const stockCode4Setting = {
    label: 'Stock Code #4',
    description: 'The 4th stock code you want to track.',
    type: 'string',
  } as SettingsString;

  const stockCode5Setting = {
    label: 'Stock Code #5',
    description: 'The 5th stock code you want to track.',
    type: 'string',
  } as SettingsString;

  const stockCode6Setting = {
    label: 'Stock Code #6',
    description: 'The 6th stock code you want to track.',
    type: 'string',
  } as SettingsString;

  const stockCode7Setting = {
    label: 'Stock Code #7',
    description: 'The 7th stock code you want to track.',
    type: 'string',
  } as SettingsString;

  const stockCode8Setting = {
    label: 'Stock Code #8',
    description: 'The 8th stock code you want to track.',
    type: 'string',
  } as SettingsString;

  const stockCode9Setting = {
    label: 'Stock Code #9',
    description: 'The 9th stock code you want to track.',
    type: 'string',
  } as SettingsString;

  const stockCode10Setting = {
    label: 'Stock Code #10',
    description: 'The 10th stock code you want to track.',
    type: 'string',
  } as SettingsString;

  const stockCode11Setting = {
    label: 'Stock Code #11',
    description: 'The 11th stock code you want to track.',
    type: 'string',
  } as SettingsString;

  const stockCode12Setting = {
    label: 'Stock Code #12',
    description: 'The 12th stock code you want to track.',
    type: 'string',
  } as SettingsString;

  const apiKeySetting = {
    label: 'Finnhub API Key',
    description:
      'The (free) API Key you get from signing up at https://finnhub.io/dashboard.',
    type: 'string',
  } as SettingsString;

  const refreshIntervalSetting = {
    label: 'Refresh Interval (minutes)',
    description: 'The amount of minutes between each refresh.',
    type: 'number',
    value: 5,
    max: 60,
    min: 1,
  } as SettingsNumber;

  DeskThing.addSettings({
    apiKey: apiKeySetting,
    refreshInterval: refreshIntervalSetting,
    stockCode1: stockCode1Setting,
    stockCode2: stockCode2Setting,
    stockCode3: stockCode3Setting,
    stockCode4: stockCode4Setting,
    stockCode5: stockCode5Setting,
    stockCode6: stockCode6Setting,
    stockCode7: stockCode7Setting,
    stockCode8: stockCode8Setting,
    stockCode9: stockCode9Setting,
    stockCode10: stockCode10Setting,
    stockCode11: stockCode11Setting,
    stockCode12: stockCode12Setting,
  });
};

// Main Entrypoint of the server
DeskThing.on('start', start);
