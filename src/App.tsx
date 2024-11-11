import React, { useEffect, useState } from 'react';
import { MarketHubStore } from './stores';
import { MarketHubData } from './stores/marketHubStore';
import Stock from './components/Stock';

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
      <div className='stocksContainer'>
        {marketHubData?.stock1 ? (
          <Stock stockData={marketHubData.stock1} />
        ) : (
          <></>
        )}
        {marketHubData?.stock2 ? (
          <Stock stockData={marketHubData.stock2} />
        ) : (
          <></>
        )}
        {marketHubData?.stock3 ? (
          <Stock stockData={marketHubData.stock3} />
        ) : (
          <></>
        )}
        {marketHubData?.stock1 ? (
          <Stock stockData={marketHubData.stock1} />
        ) : (
          <></>
        )}
        {marketHubData?.stock1 ? (
          <Stock stockData={marketHubData.stock1} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default App;
