import { useEffect, useState } from "react";
import { MarketData } from "../stores/marketStore";
import { SettingsStore } from "../stores/settingsStore";

interface MarketProps {
  marketData: MarketData | null;
}

// Move getInstance() calls outside the hook to avoid redundant calls
const settingsStore = SettingsStore.getInstance();

const Simple = ({ marketData }: MarketProps) => {
  // Initial time fetched from SettingsStore
  const [time, setTime] = useState(() => {
    return settingsStore.getTime().trim();
  });

  useEffect(() => {
    const handleTime = async (time: string) => {
      setTime(time.trim());
    };

    // Set the time listener
    const removeTimeListener = settingsStore.onTime(handleTime);

    return () => {
      // Clean up listeners on unmount
      removeTimeListener();
    };
  }, []);

  return (
    <div>
      <h1>{time}</h1>
      <p>{marketData?.c}</p>
      <p>{marketData?.h}</p>
      <p>{marketData?.l}</p>
    </div>
  );
};

export default Simple;
