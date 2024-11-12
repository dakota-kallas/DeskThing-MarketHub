import React, { useEffect, useState } from 'react';
import { MarketHubStore } from './stores';
import { MarketHubData } from './stores/marketHubStore';
import Header from './components/Header/Header';
import Stocks from './components/Stocks/Stocks';

const App: React.FC = () => {
  const marketHubStore = MarketHubStore;
  const [marketHubData, setMarketHubData] = useState<MarketHubData | null>(
    marketHubStore.getMarketHubData()
  );

  useEffect(() => {
    const handleMarketHubData = async (data: MarketHubData | null) => {
      if (!data) {
        console.log('No Market Hub data available');
        return;
      }
      console.log('Market Hub data updated:', data);
      setMarketHubData(data);
    };

    const removeListener = marketHubStore.on(handleMarketHubData);

    return () => {
      removeListener();
    };
  }, []);

  return (
    <div className='appContainer w-screen h-screen'>
      <Header lastUpdated={marketHubData?.lastUpdated} />
      <Stocks marketHubData={marketHubData} />
    </div>
  );
};

export default App;
