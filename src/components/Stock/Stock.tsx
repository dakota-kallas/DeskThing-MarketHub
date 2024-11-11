import { StockData } from '../../stores/marketHubStore';
import './stock.css';

interface StockProps {
  stockData: StockData | null;
  size: StockDisplaySize;
}

export enum StockDisplaySize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

const Stock = ({ stockData, size }: StockProps) => {
  const changeClass =
    stockData && stockData.change > 0 ? 'text-green-500' : 'text-red-500';
  const percentChangeClass =
    stockData && stockData.percentChange > 0
      ? 'text-green-500'
      : 'text-red-500';

  const stockContainerClass = `stockContainer--${size}`;

  return (
    <div className={stockContainerClass}>
      <div className='stockMain'>
        <div>
          <div className='stockMain-display'>
            <p className='stockCode'>{stockData?.code}</p>
            <img
              className='stockLogo'
              src={stockData?.logoURL}
              alt={stockData?.code}
            />
          </div>
          <p className='stockDescription'>{stockData?.description}</p>
        </div>
        <div className='stockMain--data'>
          <p>{stockData?.current}</p>
          <p className={changeClass}>{stockData?.change}</p>
        </div>
      </div>
      {size == StockDisplaySize.Large || size == StockDisplaySize.Medium ? (
        <>
          <hr />
          <div className='stockInfo'>
            <div className='stockInfo--data'>
              <label>Open</label>
              <p>{stockData?.opening}</p>
            </div>
            <div className='stockInfo--data'>
              <label>High</label>
              <p>{stockData?.high}</p>
            </div>
            <div className='stockInfo--data'>
              <label>Low</label>
              <p>{stockData?.low}</p>
            </div>
            {size == StockDisplaySize.Large ? (
              <>
                <div className='stockInfo--data'>
                  <label>% Change</label>
                  <p className={percentChangeClass}>
                    {stockData?.percentChange}
                  </p>
                </div>
                <div className='stockInfo--data'>
                  <label>Previous Close</label>
                  <p>{stockData?.previousClose}</p>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Stock;
