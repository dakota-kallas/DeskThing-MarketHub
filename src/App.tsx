import React, { useEffect, useState } from 'react';
import { MarketStore } from './stores';
import { MarketData } from './stores/marketStore';
import Stock from './components/Stock';

const App: React.FC = () => {
  const marketStore = MarketStore;
  const [marketData, setMarketData] = useState<MarketData | null>(
    marketStore.getMarketData()
  );

  useEffect(() => {
    const handleMarketData = async (data: MarketData | null) => {
      if (!data) {
        console.log('No market data available');
        return;
      }
      console.log('Market data updated:', data);
      setMarketData(data);
    };

    const removeListener = marketStore.on(handleMarketData);

    return () => {
      removeListener();
    };
  }, []);

  return (
    <div className='bg-slate-800 w-screen h-screen flex justify-center items-center'>
      <Stock marketData={marketData}/>
    </div>
  );
};

export default App;
