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

export default Stock;
