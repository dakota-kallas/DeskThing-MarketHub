import { MarketNews } from 'finnhub-ts';
import './news.css';

interface NewsProps {
  newsData: MarketNews;
}

const News = ({ newsData }: NewsProps) => {
  return <div>{newsData.headline}</div>;
};

export default News;
