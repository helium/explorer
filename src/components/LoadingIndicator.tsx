import React, { useEffect, useRef } from 'react';
import { useIsFetching } from 'react-query'
import NProgress from 'nprogress';

function LoadingIndicator() {
  const isFetching = useIsFetching()
  const currentlyFetching = useRef<boolean>(false);

  useEffect(() => {
    if (isFetching && !currentlyFetching.current) {
      NProgress.start();
      currentlyFetching.current = true;
    }

    if (!isFetching && currentlyFetching.current) {
      NProgress.done();
      currentlyFetching.current = false;
    }
  }, [isFetching]);

  return null;
}

export { LoadingIndicator };