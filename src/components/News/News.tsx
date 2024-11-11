import './news.css';
import { getTimeDifference } from '../../utilities/date';
import settingsStore from '../../stores/settingsStore';
import { useEffect, useState } from 'react';
import { MarketNewsItem } from '../../stores/marketHubStore';

interface NewsProps {
  newsData: MarketNewsItem;
}

const News = ({ newsData }: NewsProps) => {
  const currentDifference = getTimeDifference(
    settingsStore.getTime().trim(),
    newsData.time
  );
  const [difference, setDifference] = useState(currentDifference);

  useEffect(() => {
    const handleTime = async (time: string) => {
      setDifference(getTimeDifference(time, newsData.time));
    };

    // Set the time listener
    const removeTimeListener = settingsStore.onTime(handleTime);

    return () => {
      // Clean up listeners on unmount
      removeTimeListener();
    };
  }, []);

  return (
    <div className='news'>
      <div className='news--headline font-bold'>{newsData.headline}</div>
      <div className='news--date'>
        <span>{difference}</span>
        <span className='news--dateSeperator'>•</span>
        <span>{newsData.source}</span>
      </div>
    </div>
  );
};

export default News;
