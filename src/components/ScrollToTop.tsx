import { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import type { RouteComponentProps } from 'react-router';

function ScrollToTop({ history }: RouteComponentProps) {
  useEffect(() => {
    const scrollableEl = document.querySelector('#scrolling-container');

    const unlisten = history.listen(() => {
      if (scrollableEl) {
        scrollableEl.scrollTo(0, 0);
      }
    });
    return () => {
      unlisten();
    };
  }, []);

  return null;
}

export default withRouter(ScrollToTop);
