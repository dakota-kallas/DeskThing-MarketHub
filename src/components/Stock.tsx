import { useEffect, useState } from 'react';
import { StockData } from '../stores/marketHubStore';
import { SettingsStore } from '../stores/settingsStore';

interface StockProps {
  stockData: StockData | null;
}

// Move getInstance() calls outside the hook to avoid redundant calls
const settingsStore = SettingsStore.getInstance();

const Simple = ({ stockData }: StockProps) => {
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
    stockData && stockData.change > 0 ? 'text-green-500' : 'text-red-500';

  return (
    <div className='stockContainer'>
      <div>
        <p className='stockCode'>{stockData?.code}</p>
        <p className='stockDescription'>{stockData?.description}</p>
      </div>
      <div>
        <p>{stockData?.current}</p>
        <p className={changeClass}>{stockData?.change}</p>
      </div>
    </div>
  );
};

export default Simple;
