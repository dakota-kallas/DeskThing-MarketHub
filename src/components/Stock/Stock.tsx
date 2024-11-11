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
      <div className='stock'>
        <div>
          <div className='stock--display'>
            <p className='stock--code'>{stockData?.code}</p>
            {stockData?.logo ? (
              <img
                className='stock--logo'
                src={stockData?.logo}
                alt={stockData?.code}
              />
            ) : (
              <></>
            )}
          </div>
          <p className='stock--description'>{stockData?.description}</p>
        </div>
        <div className='stock--data'>
          <p>{stockData?.current}</p>
          <p className={changeClass}>{stockData?.change}</p>
        </div>
      </div>
      {size == StockDisplaySize.Large || size == StockDisplaySize.Medium ? (
        <>
          <hr />
          <div className='stock--info'>
            <div className='stock--infoData'>
              <label>Open</label>
              <p>{stockData?.opening}</p>
            </div>
            <div className='stock--infoData'>
              <label>High</label>
              <p>{stockData?.high}</p>
            </div>
            <div className='stock--infoData'>
              <label>Low</label>
              <p>{stockData?.low}</p>
            </div>
            {size == StockDisplaySize.Large ? (
              <>
                <div className='stock--infoData'>
                  <label>% Change</label>
                  <p className={percentChangeClass}>
                    {stockData?.percentChange}
                  </p>
                </div>
                <div className='stock--infoData'>
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
