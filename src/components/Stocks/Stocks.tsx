import { useEffect, useRef, useState } from 'react';
import { MarketHubData } from '../../stores/marketHubStore';
import News from '../News/News';
import Stock, { StockDisplaySize } from '../Stock/Stock';
import './stocks.css';

interface StocksProps {
  marketHubData: MarketHubData | null;
}

const Stocks = ({ marketHubData }: StocksProps) => {
  const [isTallEnough, setIsTallEnough] = useState(false);
  const contentContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = contentContainerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === container) {
          setIsTallEnough(entry.contentRect.height > 400);
        }
      }
    });

    resizeObserver.observe(container);

    // Cleanup observer on component unmount
    return () => {
      resizeObserver.unobserve(container);
      resizeObserver.disconnect();
    };
  }, [contentContainerRef.current]);

  let size: StockDisplaySize;

  switch (marketHubData?.count) {
    case 1:
    case 2:
    case 3:
      size = StockDisplaySize.Large;
      break;
    default:
      size = StockDisplaySize.Small;
      break;
  }

  const stocksContainerClasses = `stocksContainer stocksContainer--${size}`;

  console.log('marketHubData', marketHubData);

  const message =
    marketHubData && marketHubData.lastUpdated
      ? 'No Stock Data Available'
      : 'API Not Configured';

  return (
    <div className='contentContainer' ref={contentContainerRef}>
      {marketHubData && marketHubData.count > 0 ? (
        getStockNodes()
      ) : (
        <div className='info'>
          <p className='info--message'>{message}</p>
          <p className='info--description'>Double-check Configuration</p>
        </div>
      )}
      {(isTallEnough || (!isTallEnough && marketHubData?.count == 0)) &&
        marketHubData?.news &&
        marketHubData.news.length > 0 && (
          <News newsData={marketHubData.news[0]} />
        )}
      {(isTallEnough || (!isTallEnough && marketHubData?.count == 0)) &&
        marketHubData?.news &&
        marketHubData.news.length > 1 && (
          <News newsData={marketHubData.news[1]} />
        )}
    </div>
  );

  function getStockNodes() {
    return (
      <div className={stocksContainerClasses}>
        {marketHubData?.stock1 ? (
          <Stock stockData={marketHubData.stock1} size={size} />
        ) : (
          <></>
        )}
        {marketHubData?.stock2 ? (
          <Stock stockData={marketHubData.stock2} size={size} />
        ) : (
          <></>
        )}
        {marketHubData?.stock3 ? (
          <Stock stockData={marketHubData.stock3} size={size} />
        ) : (
          <></>
        )}
        {marketHubData?.stock4 ? (
          <Stock stockData={marketHubData.stock4} size={size} />
        ) : (
          <></>
        )}
        {marketHubData?.stock5 ? (
          <Stock stockData={marketHubData.stock5} size={size} />
        ) : (
          <></>
        )}
        {marketHubData?.stock6 ? (
          <Stock stockData={marketHubData.stock6} size={size} />
        ) : (
          <></>
        )}
        {marketHubData?.stock7 ? (
          <Stock stockData={marketHubData.stock7} size={size} />
        ) : (
          <></>
        )}
        {marketHubData?.stock8 ? (
          <Stock stockData={marketHubData.stock8} size={size} />
        ) : (
          <></>
        )}
        {marketHubData?.stock9 ? (
          <Stock stockData={marketHubData.stock9} size={size} />
        ) : (
          <></>
        )}
        {marketHubData?.stock10 ? (
          <Stock stockData={marketHubData.stock10} size={size} />
        ) : (
          <></>
        )}
        {marketHubData?.stock11 ? (
          <Stock stockData={marketHubData.stock11} size={size} />
        ) : (
          <></>
        )}
        {marketHubData?.stock12 ? (
          <Stock stockData={marketHubData.stock12} size={size} />
        ) : (
          <></>
        )}
      </div>
    );
  }
};

export default Stocks;
