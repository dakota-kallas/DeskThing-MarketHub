import {
  AppSettings,
  DESKTHING_EVENTS,
  SETTING_TYPES,
  SocketData,
} from "@deskthing/types";
import { DeskThing } from "@deskthing/server";
// Required export of this exact name for the server to connect
import MarketHubService from "./marketHub";

const start = async () => {
  const marketHub = MarketHubService.getInstance();
  let Data = await DeskThing.getSettings();
  DeskThing.on(DESKTHING_EVENTS.SETTINGS, (newData) => {
    // Syncs the data with the server
    Data = newData.payload;
    if (Data) {
      marketHub.updateData(Data);
    }
  });

  // This is how to add settings (implementation may vary)
  setupSettings();

  const handleGet = async (request: SocketData) => {
    if (request.request === "markethub_data") {
      console.log("Getting Market Hub data");
      const marketData = await marketHub.getMarketHub();
      if (marketData) {
        DeskThing.send({
          type: "markethub_data",
          payload: marketData,
        });
      } else {
        console.warn("Error getting Market Hub data");
      }
    }
  };

  DeskThing.on("get", handleGet);
  const stop = async () => {
    marketHub.stop();
  };
  DeskThing.on("stop", stop);
};

const setupSettings = async () => {
  const appSettings: AppSettings = {
    refreshInterval: {
      id: "refreshInterval",
      label: "Refresh Interval (minutes)",
      description: "The amount of minutes between each refresh.",
      type: SETTING_TYPES.NUMBER,
      value: 5,
      max: 60,
      min: 1,
    },
    apiKey: {
      id: "apiKey",
      label: "Finnhub API Key",
      description:
        "The (free) API Key you get from signing up at https://finnhub.io/dashboard.",
      value: "",
      type: SETTING_TYPES.STRING,
    },
    stockCode1: {
      id: "stockCode1",
      label: "Stock Code #1",
      description: "The 1st stock code you want to track.",
      value: "",
      type: SETTING_TYPES.STRING,
    },
    stockCode2: {
      id: "stockCode2",
      label: "Stock Code #2",
      description: "The 2nd stock code you want to track.",
      value: "",
      type: SETTING_TYPES.STRING,
    },
    stockCode3: {
      id: "stockCode3",
      label: "Stock Code #3",
      description: "The 3rd stock code you want to track.",
      value: "",
      type: SETTING_TYPES.STRING,
    },
    stockCode4: {
      id: "stockCode4",
      label: "Stock Code #4",
      description: "The 4th stock code you want to track.",
      value: "",
      type: SETTING_TYPES.STRING,
    },
    stockCode5: {
      id: "stockCode5",
      label: "Stock Code #5",
      description: "The 5th stock code you want to track.",
      value: "",
      type: SETTING_TYPES.STRING,
    },
    stockCode6: {
      id: "stockCode6",
      label: "Stock Code #6",
      description: "The 6th stock code you want to track.",
      value: "",
      type: SETTING_TYPES.STRING,
    },
    stockCode7: {
      id: "stockCode7",
      label: "Stock Code #7",
      description: "The 7th stock code you want to track.",
      value: "",
      type: SETTING_TYPES.STRING,
    },
    stockCode8: {
      id: "stockCode8",
      label: "Stock Code #8",
      description: "The 8th stock code you want to track.",
      value: "",
      type: SETTING_TYPES.STRING,
    },
    stockCode9: {
      id: "stockCode9",
      label: "Stock Code #9",
      description: "The 9th stock code you want to track.",
      value: "",
      type: SETTING_TYPES.STRING,
    },
    stockCode10: {
      id: "stockCode10",
      label: "Stock Code #10",
      description: "The 10th stock code you want to track.",
      value: "",
      type: SETTING_TYPES.STRING,
    },
    stockCode11: {
      id: "stockCode11",
      label: "Stock Code #11",
      description: "The 11th stock code you want to track.",
      value: "",
      type: SETTING_TYPES.STRING,
    },
    stockCode12: {
      id: "stockCode12",
      label: "Stock Code #12",
      description: "The 12th stock code you want to track.",
      value: "",
      type: SETTING_TYPES.STRING,
    },
  };

  DeskThing.initSettings(appSettings);
};

// Main Entrypoint of the server
DeskThing.on("start", start);