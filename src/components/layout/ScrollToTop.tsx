import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// TODO Fix jitter on location change
export function ScrollToTop() {
  const location = useLocation();

  useEffect(scrollToTop, [location.pathname]);

  return null;
}

export const scrollToTop = () => {
  const scrollableEl = document.getElementById('scrolling-container');

  scrollableEl!.scrollTo(0, 0);
};
