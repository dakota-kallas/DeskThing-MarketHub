import { MarketHubData } from '../../stores/marketHubStore';
import News from '../News/News';
import Stock, { StockDisplaySize } from '../Stock/Stock';
import './stocks.css';

interface StocksProps {
  marketHubData: MarketHubData | null;
}

const Stocks = ({ marketHubData }: StocksProps) => {
  if (!marketHubData) {
    return <div className='contentContainer'>No stock data available</div>;
  }

  let size: StockDisplaySize;

  switch (marketHubData.count) {
    case 1:
    case 2:
    case 3:
      size = StockDisplaySize.Large;
      break;
    case 4:
    case 5:
    case 6:
      size = StockDisplaySize.Small;
      break;
    default:
      size = StockDisplaySize.Small;
      break;
  }

  const stocksContainerClasses = `stocksContainer stocksContainer--${size}`;

  return (
    <div className='contentContainer'>
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
      {marketHubData?.news && marketHubData.news.length > 0 ? (
        <News newsData={marketHubData.news[0]} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default Stocks;
