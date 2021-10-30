import { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import type { RouteComponentProps } from 'react-router';

function ScrollToTop({ history }: RouteComponentProps) {
  useEffect(() => {
    const scrollableEl = document.getElementById('scrolling-container');

    const unlisten = history.listen(() => {
      requestAnimationFrame(() => {
        scrollableEl!.scrollTo(0, 0);
      });
    });
    return () => {
      unlisten();
    };
  }, []);

  return null;
}

export default withRouter(ScrollToTop);
