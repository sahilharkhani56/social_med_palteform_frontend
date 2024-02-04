export default function formatTimeDifference(timestamp) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - timestamp) / 1000);
  
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    } else if (diffInSeconds < 3600) {
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      return `${diffInMinutes}m`;
    } else if (diffInSeconds < 86400) {
      const diffInHours = Math.floor(diffInSeconds / 3600);
      return `${diffInHours}h`;
    } else if (diffInSeconds < 2592000) {
      const diffInDays = Math.floor(diffInSeconds / 86400);
      return `${diffInDays}d`;
    } else if (diffInSeconds < 31536000) {
      const diffInMonths = Math.floor(diffInSeconds / 2592000);
      return `${diffInMonths}mo`;
    } else {
      const diffInYears = Math.floor(diffInSeconds / 31536000);
      return `${diffInYears}y`;
    }
  }