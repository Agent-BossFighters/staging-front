import { useCallback } from 'react';
import { trackEvent } from '@utils/lib/umami';

const useUmamiTracking = () => {
  const track = useCallback((eventName, url, props) => {
    trackEvent(eventName, url, props);
  }, []);

  return { track };
};

export default useUmamiTracking;
