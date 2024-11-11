import { useEffect, useState } from 'react';
import { MarketHubData } from '../stores/marketHubStore';
import { SettingsStore } from '../stores/settingsStore';

interface MarketHubProps {
  marketHubData: MarketHubData | null;
}

// Move getInstance() calls outside the hook to avoid redundant calls
const settingsStore = SettingsStore.getInstance();

const Simple = ({ marketHubData }: MarketHubProps) => {
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

  const changeClass =
    marketHubData?.stock1 && marketHubData.stock1.change > 0
      ? 'text-green-500'
      : 'text-red-500';

  return (
    <div className='stockContainer'>
      <div>
        <p>{marketHubData?.stock1?.code}</p>
      </div>
      <div>
        <p>{marketHubData?.stock1?.current}</p>
        <p className={changeClass}>{marketHubData?.stock1?.change}</p>
      </div>
    </div>
  );
};

export default Simple;
