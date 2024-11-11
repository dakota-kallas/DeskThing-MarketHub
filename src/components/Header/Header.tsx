import { useEffect, useState } from 'react';
import { SettingsStore } from '../../stores/settingsStore';
import './header.css';

// Move getInstance() calls outside the hook to avoid redundant calls
const settingsStore = SettingsStore.getInstance();

interface HeaderProps {
  lastUpdated?: Date;
}

const Header = ({ lastUpdated }: HeaderProps) => {
  // Initial time fetched from SettingsStore
  const [time, setTime] = useState(() => {
    return settingsStore.getTime().trim();
  });

  useEffect(() => {
    const handleTime = async (time: string) => {
      setTime(time.trim());
    };

    // Set the time listener
    const removeTimeListener = settingsStore.onTime(handleTime);

    return () => {
      // Clean up listeners on unmount
      removeTimeListener();
    };
  }, []);

  if (!lastUpdated) {
    return null;
  }

  const lastUpdatedDate = new Date(lastUpdated);
  lastUpdatedDate.setSeconds(0);
  lastUpdatedDate.setMilliseconds(0);
  const date = new Date(`1970-01-01 ${time}`);
  const now = new Date();
  now.setHours(date.getHours());
  now.setMinutes(date.getMinutes());
  now.setSeconds(0);
  now.setMilliseconds(0);
  const difference = formatTimeDifference(lastUpdatedDate, now);

  return (
    <div className='headerContainer'>
      <div className='font-bold'>{time}</div>
      <div>{difference} ago</div>
    </div>
  );
};

function formatTimeDifference(startDate, endDate) {
  const diffInMilliseconds = endDate - startDate;

  // Calculate time difference components
  const seconds = Math.floor(diffInMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const remainingMinutes = minutes % 60;

  // Construct the time difference string
  let timeDiffString = '';

  if (hours > 0) {
    timeDiffString += `${hours}hr`;
  }

  if (remainingMinutes > 0) {
    if (timeDiffString) timeDiffString += ' ';
    timeDiffString += `${remainingMinutes}min`;
  }

  // Handle edge case for exact 0 minutes
  if (timeDiffString === '') {
    timeDiffString = `now`;
  }

  return timeDiffString;
}

export default Header;
