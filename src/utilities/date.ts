export function formatTimeDifference(startDate, endDate) {
  const diffInMilliseconds = endDate - startDate;

  // Calculate time difference components
  const seconds = Math.floor(diffInMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;

  // Construct the time difference string
  let timeDiffString = '';

  if (days > 0) {
    timeDiffString += `${days}d`;
  }

  if (remainingHours > 0) {
    if (timeDiffString) timeDiffString += ' ';
    timeDiffString += `${remainingHours}hr`;
  }

  if (remainingMinutes > 0) {
    if (timeDiffString) timeDiffString += ' ';
    timeDiffString += `${remainingMinutes}min`;
  }

  // Handle edge case for exact 0 minutes
  if (timeDiffString === '') {
    timeDiffString = `just now`;
  }

  return timeDiffString;
}
