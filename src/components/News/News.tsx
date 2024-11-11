import { MarketNews } from 'finnhub-ts';
import './news.css';
import { formatTimeDifference } from '../../utilities/date';

interface NewsProps {
  newsData: MarketNews;
}

const News = ({ newsData }: NewsProps) => {
  let dateDisplay = '';

  if (newsData.datetime) {
    const date = new Date(newsData.datetime * 1000);
    console.log('News Date:', date);
    const now = new Date();

    dateDisplay = formatTimeDifference(date, now);

    if (dateDisplay !== 'just now') {
      dateDisplay += ' ago';
    }
  }

  return (
    <div className='newsContainer'>
      <div className='news--headline font-bold'>{newsData.headline}</div>
      <div className='news--date'>
        <span>{dateDisplay}</span>
        <span className='news--dateSeperator'>•</span>
        <span>{newsData.source}</span>
      </div>
    </div>
  );
};

export default News;
