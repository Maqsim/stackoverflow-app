import { useEffect } from 'react';

export function ScrollToTop() {
  // const history = useTransition();

  useEffect(() => {
    const scrollableEl = document.getElementById('scrolling-container');

    // const unlisten = history.listen(() => {
    //   requestAnimationFrame(() => {
    //     scrollableEl!.scrollTo(0, 0);
    //   });
    // });
    return () => {
      // unlisten();
    };
  }, []);

  return null;
}
