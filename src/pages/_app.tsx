import React from "react";
import { ReactQueryCacheProvider, QueryCache } from "react-query";
import { Hydrate } from "react-query/hydration";

import { LoadingIndicator } from "../components/LoadingIndicator";

import "nprogress/nprogress.css";
import "../styles.css";

const queryCache = new QueryCache();

function App({ Component, pageProps }) {
  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <Hydrate state={pageProps.dehydratedState}>
        <LoadingIndicator />
        <Component {...pageProps} />
      </Hydrate>
    </ReactQueryCacheProvider>
  );
}

export default App;
