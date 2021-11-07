import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// TODO Fix jitter on location change
export function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    const scrollableEl = document.getElementById('scrolling-container');

    scrollableEl!.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}
